let submitBtn = document.getElementById("submit-btn");
const form = document.getElementById("input-form");
let liftStateEngine = [];
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
const liftRequests = new Queue();

const resetUserInput = () => {
  const inputForm = document.getElementById("input-form");
  inputForm.reset();
  let building = document.getElementById("building");
  building.innerHTML = "";
  (lifts = 0), (floors = 0), (liftStateEngine = {});
  submitBtn = document.getElementById("submit-btn");
  submitBtn.removeAttribute("disabled");
  liftRequests.clear();
  liftStateEngine = [];
};

const submitUserInput = (e) => {
  e.preventDefault();
  console.log("submitted input");
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
    console.log("lift objects are as follows : ", liftStateEngine);
    createBuilding(floors, lifts);
  }
};

const createBuilding = (floors) => {
  const building = document.getElementById("building");
  // console.log("floor lifts array: ", liftStateEngine);
  for (let floor = 0; floor <= floors; floor++) {
    createFloor(floor, building);
  }
};

const createFloor = (floorNumber, building) => {
  const floorDiv = document.createElement("div");
  floorDiv.setAttribute("class", "floor");
  floorDiv.setAttribute("id", "floor-" + floorNumber);

  const floorNumberDiv = createFloorNumberPlate(floorNumber);
  console.log("created a floorDiv: ", floorNumberDiv);

  const buttonDiv = document.createElement("div");
  buttonDiv.className = "button-div";
  const upButton = createMoveBtn(floorNumber, true);
  const downButton = createMoveBtn(floorNumber, false);

  if (floorNumber == 0) {
    const groundFloorsLifts = document.createElement("div");
    groundFloorsLifts.className = "g-lifts";

    // console.log("adding lifts to the ground floor");
    for (let liftItr = 0; liftItr < lifts; liftItr++) {
      const liftDiv = document.createElement("div");
      liftDiv.className = "lift-card";
      liftDiv.setAttribute("id", "lift-card-" + (liftItr + 1));
      liftDiv.textContent = "        ";
      const liftDoors = document.createElement("div");

      liftDoors.className = "doors";

      const rightDoor = document.createElement("div");
      rightDoor.className = `door right-door`;
      rightDoor.id = `right-door-${liftItr + 1}`;

      const leftDoor = document.createElement("div");
      leftDoor.className = `door left-door`;
      leftDoor.id = `left-door-${liftItr + 1}`;

      liftDoors.append(leftDoor, rightDoor);
      liftDiv.append(liftDoors);
      groundFloorsLifts.append(liftDiv);
    }

    buttonDiv.append(upButton);
    floorDiv.append(floorNumberDiv, buttonDiv, groundFloorsLifts);
  }

  if (floorNumber !== 0) {
    if (floorNumber !== floors) {
      buttonDiv.append(upButton, downButton);
      console.log(floorNumberDiv);
      floorDiv.append(floorNumberDiv, buttonDiv);
    } else {
      buttonDiv.append(downButton);
      floorDiv.append(floorNumberDiv, buttonDiv);
    }
  }

  building.append(floorDiv);
};

const createFloorNumberPlate = (floorNumber) => {
  const floorNumberDiv = document.createElement("div");
  floorNumberDiv.className = "floor-number";
  floorNumberDiv.textContent = floorNumber;
  // floorNumberDiv.style.border = "1px solid black";
  console.log("created a floorDiv: ", floorNumberDiv);
  return floorNumberDiv;
};

const createMoveBtn = (floorNumber, isUpButton) => {
  const moveBtn = document.createElement("button");
  moveBtn.setAttribute("class", "lift-button");
  if (isUpButton) {
    moveBtn.setAttribute("id", "upBtn-" + floorNumber);
  } else {
    moveBtn.setAttribute("id", "downBtn-" + floorNumber);
  }

  moveBtn.textContent = isUpButton ? "Up" : "Down";
  moveBtn.setAttribute("onClick", `moveLiftRequest(event,${isUpButton})`);
  return moveBtn;
};

const moveLift = (
  srcFloorNo,
  destFloorNo,
  liftNo,
  isDirectionUpwards,
  moveBtn
) => {
  const floordifference = destFloorNo - srcFloorNo;
  const lift = document.getElementById("lift-card-" + liftNo);

  lift.style.transform = `translateY(${-70 * destFloorNo}px)`;
  lift.style.transitionDuration = `${Math.abs(floordifference) * 2}s`;
  //updating the lifts-position
  liftStateEngine[liftNo - 1].floorNo = destFloorNo;
  liftStateEngine[liftNo - 1].directionUpwards = isDirectionUpwards;

  openAndCloseDoor(liftNo, floordifference, moveBtn);
};

const moveLiftRequest = (e, isUpBtn) => {
  const myButton = document.getElementById(e.target.id);
  myButton.setAttribute("disabled", true);
  const destFloorNo = parseInt(e.target.id.split("-")[1]);
  if (destFloorNo === undefined || destFloorNo == null || isNaN(destFloorNo)) {
    return;
  }
  liftRequests.enqueue({
    isUpDirection: isUpBtn,
    destn: destFloorNo,
  });
  processLiftRequest();
};

const openAndCloseDoor = (liftNo, floordifference, moveBtn) => {
  liftStateEngine[liftNo - 1].isAvailable = false;
  setTimeout(() => {
    openDoors(liftNo);
    setTimeout(() => {
      closeDoors(liftNo);
    }, 2500);
  }, Math.abs(floordifference) * 2000);

  setTimeout(() => {
    liftStateEngine[liftNo - 1].isAvailable = true;
    moveBtn.removeAttribute("disabled");
    processLiftRequest();
  }, Math.abs(floordifference) * 2000 + 5000);
};

const openDoors = (liftNo) => {
  const leftDoor = document.getElementById(`left-door-${liftNo}`);
  const rightDoor = document.getElementById(`right-door-${liftNo}`);
  leftDoor.style.transform = "translateX(-100%)";
  rightDoor.style.transform = "translateX(100%)";
};

const closeDoors = (liftNo) => {
  const leftDoor = document.getElementById(`left-door-${liftNo}`);
  const rightDoor = document.getElementById(`right-door-${liftNo}`);
  leftDoor.style.transform = "translateX(0)";
  rightDoor.style.transform = "translateX(0)";
};

const processLiftRequest = () => {
  if (liftRequests.size() != 0) {
    const liftRequest = liftRequests.peek();
    const isLiftAvailable = liftStateEngine.some((lift) => lift.isAvailable);
    if (isLiftAvailable) {
      const liftIndex = liftStateEngine.findIndex(
        (lift) =>
          lift.isAvailable === true &&
          lift.directionUpwards === liftRequest.isUpDirection &&
          lift.floorNo === liftRequest.destn
      );

      const moveBtn = liftRequest.isUpDirection
        ? document.getElementById("upBtn-" + liftRequest.destn)
        : document.getElementById("downBtn-" + liftRequest.destn);

      if (liftIndex !== -1) {
        openAndCloseDoor(liftIndex + 1, 0, moveBtn);
        liftRequests.dequeue();
      } else {
        let liftIndex = -1,
          minDist = floors + 1;
        liftStateEngine.forEach((lift, index) => {
          if (
            lift.isAvailable === true &&
            lift.directionUpwards === liftRequest.isUpDirection &&
            minDist > Math.abs(lift.floorNo - liftRequest.destn)
          ) {
            minDist = Math.abs(lift.floorNo - liftRequest.destn);
            liftIndex = index;
          }
        });
        if (liftIndex !== -1) {
          const liftDetails = liftStateEngine[liftIndex];
          moveLift(
            liftDetails.floorNo,
            liftRequest.destn,
            liftIndex + 1,
            liftRequest.isUpDirection,
            moveBtn
          );
          liftRequests.dequeue();
        } else {
          minDist = floors + 1;
          liftStateEngine.forEach((lift, index) => {
            if (
              lift.isAvailable === true &&
              minDist > Math.abs(lift.floorNo - liftRequest.destn)
            ) {
              minDist = Math.abs(lift.floorNo - liftRequest.destn);
              liftIndex = index;
            }
          });
          if (liftIndex !== -1) {
            const liftDetails = liftStateEngine[liftIndex];
            moveLift(
              liftDetails.floorNo,
              liftRequest.destn,
              liftIndex + 1,
              liftRequest.isUpDirection,
              moveBtn
            );
            liftRequests.dequeue();
          }
        }
      }
    }
  }
};
