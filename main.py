from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

app = FastAPI()
# In-memory DB (mock)
cargo_db = {}
@app.get("/")
def read_root():
    return {"message": "Welcome to Space Cargo Management API!"}


# In-memory "database"
ITEMS_DB = {}
CONTAINERS_DB = {}
LOGS_DB = []

class Coordinates(BaseModel):
    width: int
    depth: int
    height: int

class Item(BaseModel):
    itemId: str
    name: str
    width: int
    depth: int
    height: int
    priority: int
    expiryDate: str
    usageLimit: int
    preferredZone: str
    containerId: Optional[str] = None
    position: Optional[Coordinates] = None
    remainingUses: Optional[int] = None

class Container(BaseModel):
    containerId: str
    zone: str
    width: int
    depth: int
    height: int


class Position(BaseModel):
    startCoordinates: Coordinates
    endCoordinates: Coordinates

class PlacementResponse(BaseModel):
    itemId: str
    containerId: str
    position: Position

class PlacementRequest(BaseModel):
    items: List[Item]
    containers: List[Container]

class CargoItem(BaseModel):
    id: str
    name: str
    weight: float  # in kg
    destination: str

@app.post("/api/placement")
def recommend_placement(data: PlacementRequest):
    response = []
    container_space = {}

    # Initialize available space for each container
    for cont in data.containers:
        container_space[cont.containerId] = {
            "width": cont.width,
            "depth": cont.depth,
            "height": cont.height,
            "used": []  # List of placed items
        }

    # Naive placement: Fill containers based on preferred zone and available space
    for item in sorted(data.items, key=lambda x: -x.priority):  # prioritize high-priority items
        placed = False
        for cont in data.containers:
            if cont.zone == item.preferredZone:
                space = container_space[cont.containerId]
                position = try_place_item(space, item)
                if position:
                    response.append({
                        "itemId": item.itemId,
                        "containerId": cont.containerId,
                        "position": position
                    })
                    placed = True
                    break
        # Fallback: Place in any available zone if preferred zone is full
        if not placed:
            for cont in data.containers:
                space = container_space[cont.containerId]
                position = try_place_item(space, item)
                if position:
                    response.append({
                        "itemId": item.itemId,
                        "containerId": cont.containerId,
                        "position": position
                    })
                    placed = True
                    break
        if not placed:
            raise HTTPException(status_code=400, detail=f"Cannot place item {item.itemId}")

    return {"success": True, "placements": response, "rearrangements": []}

def try_place_item(space, item):
    # Simple placement at bottom-left corner (can be improved later)
    if (item.width <= space["width"] and
        item.depth <= space["depth"] and
        item.height <= space["height"]):
        
        position = {
            "startCoordinates": {"width": 0, "depth": 0, "height": 0},
            "endCoordinates": {
                "width": item.width,
                "depth": item.depth,
                "height": item.height
            }
        }
        space["used"].append(item)
        # Update available space dimensions (simplified)
        space["height"] -= item.height
        return position
    return None


# ----------------------
# API 1: Import Items
@app.post("/api/import/items")
def import_items(items: List[Item]):
    for item in items:
        item.remainingUses = item.usageLimit
        ITEMS_DB[item.itemId] = item
    return {"success": True, "itemsImported": len(items)}

# API 2: Import Containers
@app.post("/api/import/containers")
def import_containers(containers: List[Container]):
    for cont in containers:
        CONTAINERS_DB[cont.containerId] = cont
    return {"success": True, "containersImported": len(containers)}

# ----------------------
# API 3: Search API
@app.get("/api/search")
def search_item(itemId: Optional[str] = Query(None), itemName: Optional[str] = Query(None)):
    for item in ITEMS_DB.values():
        if item.itemId == itemId or item.name == itemName:
            return {
                "success": True,
                "found": True,
                "item": {
                    "itemId": item.itemId,
                    "name": item.name,
                    "containerId": item.containerId,
                    "zone": CONTAINERS_DB[item.containerId].zone if item.containerId else None,
                    "position": item.position.dict() if item.position else None
                },
                "retrievalSteps": [{"step": 1, "action": "retrieve", "itemId": item.itemId, "itemName": item.name}]
            }
    return {"success": True, "found": False}

# ----------------------
# API 4: Retrieve API
@app.post("/api/retrieve")
def retrieve_item(itemId: str, userId: Optional[str] = None):
    item = ITEMS_DB.get(itemId)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.remainingUses == 0:
        raise HTTPException(status_code=400, detail="Item has no remaining uses")

    item.remainingUses -= 1
    log_action("retrieval", itemId, userId)
    return {"success": True}

# ----------------------
# Log Function
def log_action(action_type, itemId, userId):
    LOGS_DB.append({
        "timestamp": datetime.utcnow().isoformat(),
        "userId": userId or "anonymous",
        "actionType": action_type,
        "itemId": itemId
    })
# API 5: Waste Identification
@app.get("/api/waste/identify")
def identify_waste():
    waste_items = []
    now = datetime.utcnow()
    for item in ITEMS_DB.values():
        expiry_date = datetime.strptime(item.expiryDate, "%Y-%m-%d")
        if expiry_date < now or item.remainingUses == 0:
            waste_items.append({
                "itemId": item.itemId,
                "name": item.name,
                "reason": "Expired" if expiry_date < now else "Out of Uses",
                "containerId": item.containerId,
                "position": item.position.dict() if item.position else None
            })
    return {"success": True, "wasteItems": waste_items}
# Create Cargo
@app.post("/cargo/")
def create_cargo(item: CargoItem):
    if item.id in cargo_db:
        raise HTTPException(status_code=400, detail="Item already exists.")
    cargo_db[item.id] = item
    return {"message": "Cargo item added successfully."}

# Get all Cargo
@app.get("/cargo/", response_model=List[CargoItem])
def get_all_cargo():
    return list(cargo_db.values())

# Get Cargo by ID
@app.get("/cargo/{item_id}")
def get_cargo(item_id: str):
    if item_id not in cargo_db:
        raise HTTPException(status_code=404, detail="Item not found.")
    return cargo_db[item_id]

# Update Cargo
@app.put("/cargo/{item_id}")
def update_cargo(item_id: str, item: CargoItem):
    if item_id not in cargo_db:
        raise HTTPException(status_code=404, detail="Item not found.")
    cargo_db[item_id] = item
    return {"message": "Cargo item updated."}

# Delete Cargo
@app.delete("/cargo/{item_id}")
def delete_cargo(item_id: str):
    if item_id not in cargo_db:
        raise HTTPException(status_code=404, detail="Item not found.")
    del cargo_db[item_id]
    return {"message": "Cargo item deleted."}

# Search Cargo by ID or Name (your Query part)
@app.get("/search/")
def search_item(itemId: Optional[str] = Query(None), itemName: Optional[str] = Query(None)):
    results = []
    for item in cargo_db.values():
        if itemId and item.id == itemId:
            results.append(item)
        elif itemName and item.name.lower() == itemName.lower():
            results.append(item)
    if not results:
        raise HTTPException(status_code=404, detail="No matching items found.")
    return results