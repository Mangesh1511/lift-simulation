

const form = document.getElementById("input-form");
let submitBtn = document.getElementById("submit-btn");
let liftStateEngine;
let lifts,floors;
const resetUserInput = () => {

    const inputForm = document.getElementById("input-form");
    inputForm.reset();
    let building = document.getElementById("building");
    building.innerHTML="";
    lifts=0, floors=0, liftStateEngine={};
    submitBtn = document.getElementById("submit-btn");
    submitBtn.removeAttribute("disabled");
    
}

const submitUserInput = (e) => {
    e.preventDefault();
    floors = parseInt(document.getElementById("floors").value);
    lifts = parseInt(document.getElementById("lifts").value);
    if (isNaN(floors) || isNaN(lifts)) {
        resetUserInput();
        alert('Enter valid input, please!!');
    }
    else {
        submitBtn.setAttribute('disabled', true);
        liftStateEngine = Array(lifts)
        .fill({ isAvailable: true }) 
        .map((_) => ({
          floorNo: 0,
          isAvailable: true,
          directionUpwards: true
        }));
        // console.log("lift objects are as follows : ",liftStateEngine);
        createFloors(floors, lifts);
    }


}

const createFloors = (floors) => {
    const building = document.getElementById("building");
    // console.log("floor lifts array: ", liftStateEngine);
    for (let floor = 0; floor <= floors; floor++) {
        floorDivElement(floor , building);
    }
}

const floorDivElement = (floorNumber, building) => {

    const floorDiv = document.createElement('div');
    floorDiv.setAttribute("class", "floor");
    floorDiv.setAttribute("id", "floor-" + floorNumber);

    const upButton = document.createElement("button");
    upButton.setAttribute("class", "lift-button");
    upButton.setAttribute("id", "upButton-" + (floorNumber));
    upButton.textContent = "Up";
    upButton.setAttribute("onClick", "upButton(event)");


    const downButton = document.createElement("button");
    downButton.setAttribute("class", "lift-button");
    downButton.setAttribute("id", "downButton-" + (floorNumber));
    downButton.textContent = "Down";
    downButton.setAttribute("onClick", "downButton(event)");

    if (floorNumber == 0) {
        const groundFloorsLifts = document.createElement('div');
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
            rightDoor.className=`door right-door`;
            rightDoor.id=`right-door-${noOfLifts+1}`;

            const leftDoor = document.createElement("div");
            leftDoor.className = `door left-door`;
            leftDoor.id = `left-door-${noOfLifts+1}`;
    
            liftDoors.append(leftDoor,rightDoor);
            liftDiv.append(liftDoors);
            groundFloorsLifts.append(liftDiv);
        }
        // console.log("appending ground floor lifts: ", groundFloorsLifts);
        downButton.style.visibility="hidden";
        // downButton.setAttribute("visibility","hidden");
        floorDiv.append(upButton,downButton, groundFloorsLifts);
    }

    if (floorNumber !== 0) {
        if(floorNumber!==floors){
            floorDiv.append(upButton, downButton);
        }else{
            upButton.style.visibility="hidden";
            floorDiv.append(upButton,downButton);
        }
       
    }
   
    building.append(floorDiv);
}

const upButton = (e) => {
    console.log("UpButton event: ", e.target.id.split('-')[1]);
    const destFloorNo = e.target.id.split('-')[1];
    let minDist = floors+1, srcFloorNo, liftNo, currFloorLiftCnt=0;
    for(let lift = 0; lift<lifts;lift++){
        if(liftStateEngine[lift].floorNo == destFloorNo)currFloorLiftCnt++;
    }
    console.log("no of lifts on dest floor:  ",currFloorLiftCnt);
    if(currFloorLiftCnt>=1){
        for(let lift = 0; lift<lifts;lift++){
            if(liftStateEngine[lift].floorNo == destFloorNo && liftStateEngine[lift].directionUpwards == true){
                if(liftStateEngine[lift].isAvailable==true){
                    // console.log("lift : "+lift+" is available.");
                    openDoors(lift+1);
                        setTimeout(()=>{
                            closeDoors(lift+1);
                        },2500);
                }
                return;
            }
        }
    }
    for(let lift =0 ;lift<lifts;lift++){
        // console.log("checking lift is available or not : liftno: ",lift+1);
        if((liftStateEngine[lift].isAvailable === true) && Math.abs(destFloorNo-liftStateEngine[lift].floorNo)!==0  && (minDist>Math.abs(destFloorNo-liftStateEngine[lift].floorNo))){
            // console.log(" lift is available   : liftno: ",lift+1, liftStateEngine[lift].isAvailable);
            // console.log("distance is: ",Math.abs(destFloorNo-liftStateEngine[lift].floorNo))
            srcFloorNo = liftStateEngine[lift].floorNo;
            minDist = Math.abs(destFloorNo-liftStateEngine[lift].floorNo);
            liftNo = lift+1;
        }
        
    }
    // console.log("srcFloor is: ",srcFloorNo , "dest floor is: ", destFloorNo, "lift no is",liftNo);
    if(destFloorNo == undefined || srcFloorNo==undefined){
        return;
     }
     else if(destFloorNo!== srcFloorNo){
        //  console.log("moving lift from floor: "+srcFloorNo+"to dest floor no : "+destFloorNo);
         moveLift(srcFloorNo, destFloorNo, liftNo, true);
     }

}

const downButton = (e) => {
    // console.log("downButton event: ", e.target.id.split('-')[1]);
    const destFloorNo =parseInt( e.target.id.split('-')[1]);
    let minDist = floors+1, srcFloorNo, liftNo,currFloorLiftCnt=0;
    for(let lift = 0; lift<lifts;lift++){
        if(liftStateEngine[lift].floorNo == destFloorNo)currFloorLiftCnt++;
    }
    // console.log("lift count at the floor is: ",currFloorLiftCnt);
    if(currFloorLiftCnt>=1){
        for(let lift = 0; lift<lifts;lift++){
            // console.log("checking the lift no: ",lift);
            // console.log(liftStateEngine[lift]);
            // console.log(liftStateEngine[lift].floorNo," ",destFloorNo," state: ",liftStateEngine[lift].directionUpwards);
            if((liftStateEngine[lift].floorNo === destFloorNo) && (liftStateEngine[lift].directionUpwards === false)){
                // console.log("lift: "+lift + "is already going in downward direction");
                if(liftStateEngine[lift].isAvailable==true){
                    // console.log("lift : "+lift+" is available.");
                    openDoors(lift+1);
                        setTimeout(()=>{
                            closeDoors(lift+1);
                        },2500);
                }
                return;
            }
        }
    }
    for(let lift =0 ;lift<lifts;lift++){
        console.log("checking lift is available or not : liftno: ",lift+1);
        // console.log(liftStateEngine[lift]);
        if((liftStateEngine[lift].isAvailable === true) &&(Math.abs(destFloorNo-liftStateEngine[lift].floorNo)!==0) &&  (minDist>Math.abs(destFloorNo-liftStateEngine[lift].floorNo))){
            // console.log(" lift is available   : liftno: ",lift+1);
            // console.log("distance is: ",Math.abs(destFloorNo-liftStateEngine[lift].floorNo))

            srcFloorNo = liftStateEngine[lift].floorNo;
            minDist = Math.abs(destFloorNo-liftStateEngine[lift].floorNo);
            // console.log("updating minDist is: ",minDist);
            liftNo = lift+1;
        }
        
    }
    if(destFloorNo?.isNaN ||  srcFloorNo?.isNaN){
       return;
    }
    else if(destFloorNo!= srcFloorNo){
        // console.log("moving lift from floor: "+srcFloorNo+"to dest floor no : "+destFloorNo);
        moveLift(srcFloorNo, destFloorNo, liftNo, false);
    }
}

const moveLift = (srcFloorNo, destFloorNo, liftNo, isDirectionUpwards) => {

    const floordifference = destFloorNo - srcFloorNo;
    // console.log("lift-card-"+liftNo);
    const lift  = document.getElementById("lift-card-"+liftNo);

    lift.style.transform = `translateY(${-70*(destFloorNo)}px)`;
    lift.style.transitionDuration = `${Math.abs(floordifference)*2}s`;
    //updating the lifts-position
    liftStateEngine[liftNo-1].floorNo = destFloorNo;
    liftStateEngine[liftNo - 1].isAvailable = false;
    liftStateEngine[liftNo-1].directionUpwards = isDirectionUpwards;
    // console.log("lift is not available");
    // console.log("updating lift state to : ",liftStateEngine[liftNo-1].isAvailable);
    setTimeout(()=>{
        openDoors(liftNo);
        setTimeout(()=>{
            closeDoors(liftNo);
        },2500);
    }, ((Math.abs(floordifference))*2000));

   setTimeout(()=>{
    liftStateEngine[liftNo-1].isAvailable = true;
   },Math.abs(floordifference)*2000+5000);
}

const openDoors = (liftNo) => {
    // console.log("open doors");
    const leftDoor = document.getElementById(`left-door-${liftNo}`);
    const rightDoor = document.getElementById(`right-door-${liftNo}`);
    leftDoor.style.transform = 'translateX(-100%)';
    rightDoor.style.transform = 'translateX(100%)'; 

  }
  
const  closeDoors = (liftNo) => {
    // console.log("closing doors");
    const leftDoor = document.getElementById(`left-door-${liftNo}`);
    const rightDoor = document.getElementById(`right-door-${liftNo}`);
    leftDoor.style.transform = 'translateX(0)';
    rightDoor.style.transform = 'translateX(0)';
  
  }
  