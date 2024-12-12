const form = document.getElementById("input-form");
let submitBtn = document.getElementById("submit-btn");
let liftStateEngine;
let lifts, floors;
class Queue {
    constructor() {
        this.items = [];
    }

    // Add an element to the end of the queue
    enqueue(element) {
        this.items.push(element);
    }

    // Remove and return the first element from the queue
    dequeue() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items.shift();
    }

    // Check the first element in the queue
    peek() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items[0];
    }

    // Check if the queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get the size of the queue
    size() {
        return this.items.length;
    }

    // Clear the queue
    clear() {
        this.items = [];
    }
}

// Example usage:
const pendingTasks = new Queue();

const resetUserInput = () => {
    const inputForm = document.getElementById("input-form");
    inputForm.reset();
    let building = document.getElementById("building");
    building.innerHTML = "";
    (lifts = 0), (floors = 0), (liftStateEngine = {});
    submitBtn = document.getElementById("submit-btn");
    submitBtn.removeAttribute("disabled");
};

const submitUserInput = (e) => {
    e.preventDefault();
    floors = parseInt(document.getElementById("floors").value);
    lifts = parseInt(document.getElementById("lifts").value);
    if (isNaN(floors) || isNaN(lifts)) {
        resetUserInput();
        alert("Enter valid input, please!!");
    } else {
        submitBtn.setAttribute("disabled", true);
        liftStateEngine = Array(lifts)
            .fill({ isAvailable: true })
            .map((_) => ({
                floorNo: 0,
                isAvailable: true,
                directionUpwards: true,
            }));
        // console.log("lift objects are as follows : ",liftStateEngine);
        createFloors(floors, lifts);
    }
};

const createFloors = (floors) => {
    const building = document.getElementById("building");
    // console.log("floor lifts array: ", liftStateEngine);
    for (let floor = 0; floor <= floors; floor++) {
        floorDivElement(floor, building);
    }
};

const floorDivElement = (floorNumber, building) => {
    const floorDiv = document.createElement("div");
    floorDiv.setAttribute("class", "floor");
    floorDiv.setAttribute("id", "floor-" + floorNumber);

    const floorNumberDiv = document.createElement("div");
    floorNumberDiv.className="floor-number";
    floorNumberDiv.textContent=floorNumber;
    floorNumberDiv.style.border = "1px solid black";
    floorNumberDiv.style.padding = "10px";
    floorNumberDiv.style.margin = "10px";
    floorNumberDiv.style.backgroundColor = "white";
    const buttonDiv = document.createElement("div");
    buttonDiv.className="button-div";
    const upButton = document.createElement("button");
    upButton.setAttribute("class", "lift-button");
    upButton.setAttribute("id", "upButton-" + floorNumber);
    upButton.textContent = "Up";
    upButton.setAttribute("onClick", "upButton(event)");

    const downButton = document.createElement("button");
    downButton.setAttribute("class", "lift-button");
    downButton.setAttribute("id", "downButton-" + floorNumber);
    downButton.textContent = "Down";
    downButton.setAttribute("onClick", "downButton(event)");

    if (floorNumber == 0) {
        const groundFloorsLifts = document.createElement("div");
        groundFloorsLifts.className = "g-lifts";

        // console.log("adding lifts to the ground floor");
        for (let noOfLifts = 0; noOfLifts < lifts; noOfLifts++) {
            const liftDiv = document.createElement("div");
            liftDiv.className = "lift-card";
            liftDiv.setAttribute("id", "lift-card-" + (noOfLifts + 1));
            liftDiv.textContent = "        ";
            const liftDoors = document.createElement("div");

            liftDoors.className = "doors";

            const rightDoor = document.createElement("div");
            rightDoor.className = `door right-door`;
            rightDoor.id = `right-door-${noOfLifts + 1}`;

            const leftDoor = document.createElement("div");
            leftDoor.className = `door left-door`;
            leftDoor.id = `left-door-${noOfLifts + 1}`;

            liftDoors.append(leftDoor, rightDoor);
            liftDiv.append(liftDoors);
            groundFloorsLifts.append(liftDiv);
        }
        // console.log("appending ground floor lifts: ", groundFloorsLifts);

        // downButton.style.visibility = "hidden";
        buttonDiv.append(upButton);
        // downButton.setAttribute("visibility","hidden");
        floorDiv.append(floorNumberDiv, buttonDiv, groundFloorsLifts);
    }

    if (floorNumber !== 0) {
        if (floorNumber !== floors) {
            buttonDiv.append(upButton, downButton);
            floorDiv.append(floorNumberDiv, buttonDiv);
        } else {
            buttonDiv.append(downButton);
            floorDiv.append(floorNumberDiv, buttonDiv);
        }
    }

    building.append(floorDiv);
};

const upButton = (e) => {
    console.log("UpButton event: ", e.target.id.split("-")[1]);
    const destFloorNo = e.target.id.split("-")[1];
    let minDist = floors + 1,
        srcFloorNo,
        liftNo,
        currFloorLiftCnt = 0;
    for (let lift = 0; lift < lifts; lift++) {
        if (liftStateEngine[lift].floorNo == destFloorNo) currFloorLiftCnt++;
    }
    console.log("no of lifts on dest floor:  ", currFloorLiftCnt);
    if (currFloorLiftCnt >= 1) {
        for (let lift = 0; lift < lifts; lift++) {
            if (
                liftStateEngine[lift].floorNo == destFloorNo &&
                liftStateEngine[lift].directionUpwards == true
            ) {
                if (liftStateEngine[lift].isAvailable == true) {
                    liftStateEngine[lift].isAvailable = false;
                    // console.log("lift : "+lift+" is available.");
                    openDoors(lift + 1);
                    setTimeout(() => {
                        closeDoors(lift + 1);
                        liftStateEngine[lift].isAvailable = true;
                    }, 2500);
                }
                return;
            }
        }
    }
    for (let lift = 0; lift < lifts; lift++) {
        // console.log("checking lift is available or not : liftno: ",lift+1);
        if (
            liftStateEngine[lift].isAvailable === true &&
            Math.abs(destFloorNo - liftStateEngine[lift].floorNo) !== 0 &&
            minDist > Math.abs(destFloorNo - liftStateEngine[lift].floorNo)
        ) {
            // console.log(" lift is available   : liftno: ",lift+1, liftStateEngine[lift].isAvailable);
            // console.log("distance is: ",Math.abs(destFloorNo-liftStateEngine[lift].floorNo))
            srcFloorNo = liftStateEngine[lift].floorNo;
            minDist = Math.abs(destFloorNo - liftStateEngine[lift].floorNo);
            liftNo = lift + 1;
        }
    }
    // console.log("srcFloor is: ",srcFloorNo , "dest floor is: ", destFloorNo, "lift no is",liftNo);
    if (destFloorNo == undefined || srcFloorNo == undefined) {
        if (srcFloorNo == undefined) {
            //seems the case where all lifts are pending in this case, we have to save this pending task
            const obj = {
                event: e,
                isUpButton: true,
            };
            pendingTasks.enqueue(obj);
        }
    } else if (destFloorNo !== srcFloorNo) {
        //  console.log("moving lift from floor: "+srcFloorNo+"to dest floor no : "+destFloorNo);
        moveLift(srcFloorNo, destFloorNo, liftNo, true);
    }
};

const downButton = (e) => {
    // console.log("downButton event: ", e.target.id.split('-')[1]);
    const destFloorNo = parseInt(e.target.id.split("-")[1]);
    let minDist = floors + 1,
        srcFloorNo,
        liftNo,
        currFloorLiftCnt = 0;
    for (let lift = 0; lift < lifts; lift++) {
        if (liftStateEngine[lift].floorNo == destFloorNo) currFloorLiftCnt++;
    }
    // console.log("lift count at the floor is: ",currFloorLiftCnt);
    if (currFloorLiftCnt >= 1) {
        for (let lift = 0; lift < lifts; lift++) {
            // console.log("checking the lift no: ",lift);
            // console.log(liftStateEngine[lift]);
            // console.log(liftStateEngine[lift].floorNo," ",destFloorNo," state: ",liftStateEngine[lift].directionUpwards);
            if (
                liftStateEngine[lift].floorNo === destFloorNo &&
                liftStateEngine[lift].directionUpwards === false
            ) {
                // console.log("lift: "+lift + "is already going in downward direction");
                if (liftStateEngine[lift].isAvailable == true) {
                    liftStateEngine[lift].isAvailable = false;
                    openDoors(lift + 1);
                    setTimeout(() => {
                        closeDoors(lift + 1);
                        liftStateEngine[lift].isAvailable = true;
                    }, 2500);
                }
                return;
            }
        }
    }
    for (let lift = 0; lift < lifts; lift++) {
        // console.log("checking lift is available or not : liftno: ", lift + 1);
        // console.log(liftStateEngine[lift]);
        if (
            liftStateEngine[lift].isAvailable === true &&
            Math.abs(destFloorNo - liftStateEngine[lift].floorNo) !== 0 &&
            minDist > Math.abs(destFloorNo - liftStateEngine[lift].floorNo)
        ) {
            // console.log(" lift is available   : liftno: ",lift+1);
            // console.log("distance is: ",Math.abs(destFloorNo-liftStateEngine[lift].floorNo))

            srcFloorNo = liftStateEngine[lift].floorNo;
            minDist = Math.abs(destFloorNo - liftStateEngine[lift].floorNo);
            // console.log("updating minDist is: ",minDist);
            liftNo = lift + 1;
        }
    }
    if (destFloorNo == undefined || srcFloorNo == undefined) {
        if (srcFloorNo == undefined) {
            //seems the case where all lifts are pending in this case, we have to save this pending task
            const obj = {
                event: e,
                isUpButton: false,
            };
            pendingTasks.enqueue(obj);
        }
    } else if (destFloorNo != srcFloorNo) {
        // console.log("moving lift from floor: "+srcFloorNo+"to dest floor no : "+destFloorNo);
        moveLift(srcFloorNo, destFloorNo, liftNo, false);
    }
};

const moveLift = (srcFloorNo, destFloorNo, liftNo, isDirectionUpwards) => {
    const floordifference = destFloorNo - srcFloorNo;
    // console.log("lift-card-"+liftNo);
    const lift = document.getElementById("lift-card-" + liftNo);

    lift.style.transform = `translateY(${-70 * destFloorNo}px)`;
    lift.style.transitionDuration = `${Math.abs(floordifference) * 2}s`;
    //updating the lifts-position
    liftStateEngine[liftNo - 1].floorNo = destFloorNo;
    liftStateEngine[liftNo - 1].isAvailable = false;
    liftStateEngine[liftNo - 1].directionUpwards = isDirectionUpwards;
    // console.log("lift is not available");
    // console.log("updating lift state to : ",liftStateEngine[liftNo-1].isAvailable);
    setTimeout(() => {
        openDoors(liftNo);
        setTimeout(() => {
            closeDoors(liftNo);
        }, 2500);
    }, Math.abs(floordifference) * 2000);

    setTimeout(() => {
        liftStateEngine[liftNo - 1].isAvailable = true;
    }, Math.abs(floordifference) * 2000 + 5000);
};

const openDoors = (liftNo) => {
    // console.log("open doors");
    const leftDoor = document.getElementById(`left-door-${liftNo}`);
    const rightDoor = document.getElementById(`right-door-${liftNo}`);
    leftDoor.style.transform = "translateX(-100%)";
    rightDoor.style.transform = "translateX(100%)";
};

const closeDoors = (liftNo) => {
    // console.log("closing doors");
    const leftDoor = document.getElementById(`left-door-${liftNo}`);
    const rightDoor = document.getElementById(`right-door-${liftNo}`);
    leftDoor.style.transform = "translateX(0)";
    rightDoor.style.transform = "translateX(0)";
};

function checkPendingTasks() {
    // console.log("checking pending tasks, length is:" + pendingTasks.size());
    if (pendingTasks.isEmpty() === true) return;
    let liftIsAvailable = false;
    for (let lift = 0; lift < lifts; lift++) {
        if (liftStateEngine[lift].isAvailable == true) {
            liftIsAvailable = true;
            break;
        }
    }

    if (liftIsAvailable) {
        const pendingRequest = pendingTasks.peek();

        if (pendingRequest.isUpButton === true) {
            // console.log("going to call up button");
            upButton(pendingRequest.event);
            pendingTasks.dequeue();
        } else {
            // console.log("going to call down button");
            downButton(pendingRequest.event);
            pendingTasks.dequeue();
        }
    }
}

setInterval(checkPendingTasks, 1000);
