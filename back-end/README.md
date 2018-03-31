# Prognostic System #

## Build & Run ##
Build using sbt.

The service is deployed at http://gaudi.ga/api

## Postman script ##
https://www.getpostman.com/collections/6954d61ce6f125c4bb39

## REST API ##

●	get(“/missions”) – returns the list of all the missions in JSON.

●	post(“/missions”) – pass to this method name, startDate, routeStart, routeFinish to add to the missions list.

Example:
```json
{
  "name": "Mission 1",
  "startDate": "20.03.2018",
  "routeStart": "Moscow",
  "routeFinish": "St. Petersburg"
}
```

●	put(“/missions”) – pass to this method id, name, startDate, routeStart, routeFinish to update the mission.
Example:
```json
{
  "id": 1,
  "name": "Mission 1",
  "startDate": "20.03.2018",
  "routeStart": "Moscow",
  "routeFinish": "Rome"
}
```
●	delete(“/missions/:id”) – deletes the mission by its id.

●	post("/missions/addvehicles") - pass to this method the id of a mission and ids of vehicles to add the vehicles to the mission.
Example:
```json
{
  "mid": 1,
  "vids": [1, 2, 3]
}
```

●	get(“/vehicles”) – returns the list of all the vehicles in JSON.

●	post(“/vehicles”) – pass to this method vtype, model, sn, status to add to the vehicles list.  
Example:
```json
{
  "vtype": "Heavy Truck",
  "model": "Kamaz",
  "sn": "01110101010064984954065",
  "state": 100
}
```
●	put(“/vehicles”) – pass to this method id, vtype, model, sn, status to update the vehicle.
Example:
```json
{
  "id": 1,
  "vtype": "Heavy Truck",
  "model": "Volvo",
  "sn": "01110101010064984954065",
  "state": 100
}
```
●	delete("/vehicles/:id") - deletes the vehicle by its id.