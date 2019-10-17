function conflictNonAdjacentConveyors(conveyorBeltList, origin, destiny) {
    let minX = Math.min(origin.x, destiny.x);
    let maxX = Math.max(origin.x, destiny.x);

    let intersectingConveyors = new Array();
    conveyorBeltList.forEach(function(conveyor) {
        conveyor.setColor("0xFFFFFF");
        let isVerticalConveyor = conveyor.start.y == LEVEL_DIMENSIONS.laneTopMargin;
        if (isVerticalConveyor) {
            let conveyorX = conveyor.start.x;
            if (conveyorX > minX && conveyorX < maxX) {
                intersectingConveyors.push(conveyor);
            }
        }
    });

    intersectingConveyors.forEach(function(conveyor) {
        conveyor.setColor(WRONG_PATH_COLOR);
    });
    
}

function conflictConveyorOnScanner(scanners, origin, destiny) {

}

function conflictPathIntersection(conveyorBeltList, origin, destiny) {

}

function conflictNewBeltCloseToExistent(conveyorBeltList, origin, destiny) {

}