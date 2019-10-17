function conflictNonAdjacentConveyors(conveyorBeltList, origin, destiny, tintedDrawables) {
    let minX = Math.min(origin.x, destiny.x);
    let maxX = Math.max(origin.x, destiny.x);

    conveyorBeltList.forEach(function(conveyor) {
        let isVerticalConveyor = conveyor.isVerticalConveyor();
        if (isVerticalConveyor) {
            let conveyorX = conveyor.start.x;
            if (conveyorX > minX && conveyorX < maxX) {
                conveyor.setColor(WRONG_PATH_COLOR);
                tintedDrawables.push(conveyor);
            } else {
                conveyor.setColor("0xFFFFFF");
            }
        }
    });    
}

function conflictConveyorOnScanner(scanners, origin, destiny, tintedDrawables) {
    let closestScanner = null;
    let minDistance = Infinity;

    scanners.forEach(function(scanner) {
        scanner.setColor("0xFFFFFF");

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

    closestScanner.setColor(WRONG_PATH_COLOR);
    tintedDrawables.push(closestScanner);
}

function conflictPathIntersection(conveyorBeltList, origin, destiny, tintedDrawables) {
    // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function

    let originX = origin.x;
    let originY = origin.y;
    let destinyX = destiny.x;
    let destinyY = destiny.y;
    conveyorBeltList.forEach(function(conveyor) {
        let conveyorStartX = conveyor.start.x;
        let conveyorStartY = conveyor.start.y;
        let conveyorEndX = conveyor.end.x;
        let conveyorEndY = conveyor.end.y;

        var det, gamma, lambda;
        det = (destinyX - originX) * (conveyorEndY - conveyorStartY) - (conveyorEndX - conveyorStartX) * (destinyY - originY);
        if (det !== 0) {
            lambda = ((conveyorEndY - conveyorStartY) * (conveyorEndX - originX) + (conveyorStartX - conveyorEndX) * (conveyorEndY - originY)) / det;
            gamma = ((originY - destinyY) * (conveyorEndX - originX) + (destinyX - originX) * (conveyorEndY - originY)) / det;
            let intersect = (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
            if (intersect) {
                conveyor.setColor(WRONG_PATH_COLOR);
                tintedDrawables.push(conveyor);
            } else {
                conveyor.setColor("0xFFFFFF");
            }
        }
    });
}

function conflictNewBeltCloseToExistent(conveyorBeltList, origin, destiny, tintedDrawables) {
    let closestConveyorToOrigin = null;
    let distanceToOriginsClosestConveyor = Infinity;
    let closestConveyorToDestiny = null;
    let distanceToDestinysClosestConveyor = Infinity;

    conveyorBeltList.forEach(function(conveyor) {
        conveyor.setColor("0xFFFFFF");
        if (!conveyor.isVerticalConveyor()) {
            // Find conveyor's node closest to origin
            let distanceOrigin_ConveyorStart = Math.sqrt(
                Math.pow(origin.x - conveyor.start.x, 2) +
                Math.pow(origin.y - conveyor.start.y, 2)
            );

            let distanceOrigin_ConveyorEnd = Math.sqrt(
                Math.pow(origin.x - conveyor.end.x, 2) +
                Math.pow(origin.y - conveyor.end.y, 2)
            );

            let minDistanceOrigin_Conveyor = Math.min(distanceOrigin_ConveyorStart, distanceOrigin_ConveyorEnd);

            // Find conveyor's node closest to destiny
            let distanceDestiny_ConveyorStart = Math.sqrt(
                Math.pow(destiny.x - conveyor.start.x, 2) +
                Math.pow(destiny.y - conveyor.start.y, 2)
            );

            let distanceDestiny_ConveyorEnd = Math.sqrt(
                Math.pow(destiny.x - conveyor.end.x, 2) +
                Math.pow(destiny.y - conveyor.end.y, 2)
            );

            let minDistanceDestiny_Conveyor = Math.min(distanceDestiny_ConveyorStart, distanceDestiny_ConveyorEnd);

            // Update variables outside of the loop
            if (minDistanceOrigin_Conveyor < distanceToOriginsClosestConveyor) {
                distanceToOriginsClosestConveyor = minDistanceOrigin_Conveyor;
                closestConveyorToOrigin = conveyor;
            }

            if (minDistanceDestiny_Conveyor < distanceToDestinysClosestConveyor) {
                distanceToDestinysClosestConveyor = minDistanceDestiny_Conveyor;
                closestConveyorToDestiny = conveyor;
            }
        }

        // Display the belts only if they are close enough
        if (distanceToOriginsClosestConveyor < MIN_DISTANCE_BETWEEN_NODES) {
            closestConveyorToOrigin.setColor(WRONG_PATH_COLOR);
            tintedDrawables.push(closestConveyorToOrigin);
        }

        if (distanceToDestinysClosestConveyor < MIN_DISTANCE_BETWEEN_NODES) {
            closestConveyorToDestiny.setColor(WRONG_PATH_COLOR);
            tintedDrawables.push(closestConveyorToDestiny);
        }
    });
}
