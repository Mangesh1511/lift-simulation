

const form = document.getElementById("input-form");
const submitBtn = document.getElementById("submit-btn");
let floors , lifts;

const resetUserInput = (e) =>{
    floors = parseInt(document.getElementById("floors").value);
    lifts = parseInt(document.getElementById("lifts").value);
    floorValue =document.getElementById("floors");
    liftValue = document.getElementById("lifts");
    floorValue.value=0;
    liftValue.value=0;
    // lifts=0;
    console.log("floors: ",floors," lifts: ",lifts);
    submitBtn.setAttribute("disabled",false);

}

const submitUserInput= (e)=>{
    e.preventDefault();
    floors = parseInt(document.getElementById("floors").value);
    lifts = parseInt(document.getElementById("lifts").value);
    console.log("submitUser input" ,floors,lifts);
    if(isNaN(floors) || isNaN(lifts)){
        resetUserInput(e);
        alert('Enter valid input, please!!');
        
    }
    else{
        console.log("in the else code");
        submitBtn.setAttribute('disabled',true);

        console.log("floors: ",floors," lifts: ",lifts);
        let floorArray = new Array(lifts).fill(0);
        floorArray[0]=lifts;
        console.log("floor lifts array: ",floorArray);
        createFloors(floors, lifts,floorArray);
    }
    

}

const createFloors = (floors, lifts, floorArray) =>{
    const building = document.getElementById("building");
    console.log("floor lifts array: ",floorArray);
    for(let floor =floors;floor>=0;floor--){   
        console.log("floorNumber: ",floor," no of lifts: ",floorArray[floor]); 
       floorDivElement(floors,floor,building, floorArray[floor]);
    }
}

const floorDivElement = (floors,floorNumber,building,lifts) =>{
//     <div class ="floor">
//     <button type="submit" class="lift-button" onCick="upButton">Up</button>
//     <button type ="submit"class="lift-button" onClick = "downButton">Down</button>
//     <div class="floor-number">1</div>
// </div>
    const floorDiv = document.createElement('div');
    floorDiv.setAttribute("class", "floor"); 
   
    const upButton = document.createElement("button");
    upButton.setAttribute("class","lift-button");
    upButton.type="submit";
    upButton.textContent="Up";

    const downButton = document.createElement("button");
    downButton.setAttribute("class","lift-button");
    downButton.type="submit";
    downButton.textContent="Down";

    const floorNumberDiv = document.createElement("div");
    floorNumberDiv.setAttribute("class","floor-number");
    floorNumberDiv.textContent=(floorNumber+1);
    floorDiv.append(upButton, downButton);
    const liftCardsList = document.createElement("div");
    liftCardsList.className="lifts-cards-list";
    for(let noOfLifts =0;noOfLifts<lifts;noOfLifts++){
        const liftDiv = document.createElement("div");
        liftDiv.className="lift-card";
        liftDiv.textContent="        ";
        liftCardsList.append(liftDiv);
    }
    floorDiv.append(liftCardsList);
    // console.log(floorDiv);
    building.append(floorDiv);
}

const addLiftCards=(floorNumberD)=>{

}