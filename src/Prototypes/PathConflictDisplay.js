function conflictNonAdjacentConveyors(conveyorBeltList, origin, destiny) {
    let minX = Math.min(origin.x, destiny.x);
    let maxX = Math.max(origin.x, destiny.x);

    let intersectingConveyors = new Array();
    conveyorBeltList.forEach(function(conveyor) {
        conveyor.setColor("0xFFFFFF");
        let isVerticalConveyor = conveyor.isVerticalConveyor();
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
    let closestScanner = null;
    let minDistance = Infinity;

    scanners.forEach(function(scanner) {
        // TODO: Cambiar el color del escaner

        let scannerX = scanner.x;
        let scannerY = scanner.start;

        let distanceToOrigin = Math.sqrt(
            Math.pow(scannerX - origin.x, 2) + 
            Math.pow(scannerY - origin.y, 2)
        );

        let distanceToDestiny = Math.sqrt(
            Math.pow(scannerX - destiny.x, 2) + 
            Math.pow(scannerY - destiny.y, 2)
        );

        let closestDistance = Math.min(distanceToOrigin, distanceToDestiny);
        if (closestDistance < minDistance) {
            minDistance = closestDistance;
            closestScanner = scanner;
        }
    });

    // TODO: Cambiar el color del escaner
    console.log(closestScanner);
}

function conflictPathIntersection(conveyorBeltList, origin, destiny) {

}

function conflictNewBeltCloseToExistent(conveyorBeltList, origin, destiny) {

}