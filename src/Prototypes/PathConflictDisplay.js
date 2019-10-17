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
    let closestConveyorToOrigin = null;
    let distanceToOriginsClosestConveyor = Infinity;
    let closestConveyorToDestiny = null;
    let distanceToDestinysClosestConveyor = Infinity;

    conveyorBeltList.forEach(function(conveyor) {
        conveyor.setColor("0xFFFFFF");
        if (!conveyor.isVerticalConveyor()) {
            let distanceOrigin_ConveyorStart = Math.sqrt(
                Math.pow(origin.x - conveyor.start.x, 2) +
                Math.pow(origin.y - conveyor.start.y, 2)
            );

            let distanceOrigin_ConveyorEnd = Math.sqrt(
                Math.pow(origin.x - conveyor.end.x, 2) +
                Math.pow(origin.y - conveyor.end.y, 2)
            );

            let minDistanceOrigin_Conveyor = Math.min(distanceOrigin_ConveyorStart, distanceOrigin_ConveyorEnd);

            let distanceDestiny_ConveyorStart = Math.sqrt(
                Math.pow(destiny.x - conveyor.start.x, 2) +
                Math.pow(destiny.y - conveyor.start.y, 2)
            );

            let distanceDestiny_ConveyorEnd = Math.sqrt(
                Math.pow(destiny.x - conveyor.end.x, 2) +
                Math.pow(destiny.y - conveyor.end.y, 2)
            );

            let minDistanceDestiny_Conveyor = Math.min(distanceDestiny_ConveyorStart, distanceDestiny_ConveyorEnd);

            if (minDistanceOrigin_Conveyor < distanceToOriginsClosestConveyor) {
                distanceToOriginsClosestConveyor = minDistanceOrigin_Conveyor;
                closestConveyorToOrigin = conveyor;
            }

            if (minDistanceDestiny_Conveyor < distanceToDestinysClosestConveyor) {
                distanceToDestinysClosestConveyor = minDistanceDestiny_Conveyor;
                closestConveyorToDestiny = conveyor;
            }
        }

        if (distanceToOriginsClosestConveyor < MIN_DISTANCE_BETWEEN_NODES) {
            closestConveyorToOrigin.setColor(WRONG_PATH_COLOR);
        }

        if (distanceToDestinysClosestConveyor < MIN_DISTANCE_BETWEEN_NODES) {
            closestConveyorToDestiny.setColor(WRONG_PATH_COLOR);
        }
    });
}