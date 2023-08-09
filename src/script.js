let isOrderAccepted = false;
let isValetFound = false;
let hasRestaurantSeenYourOrder = false;
let restaurantTimer = null;
let valetTimer = null;
let valetDeliveryTimer = null;
let isOrderDelivered = false;

// Zomato App - Boot up/ power up/ start
window.addEventListener('load',function(){
    document.getElementById('acceptOrder')
        .addEventListener('click',function(){
            askRestaurantToAcceptOrReject();
        })

        document.getElementById('findValet')
        .addEventListener('click',function(){
            startSearchingForValets();
        })
        
        document.getElementById('deliverOrder')
        .addEventListener('click',function(){
            setTimeout(()=>{
                isOrderDelivered = true; 
            },2000)
        })

        checkIfOrderAcceptedFromRestaurant()
        .then(isOrderAccepted=>{
            console.log('Updated from Restaurant - ',isOrderAccepted);
            // step  - start preparing
            if(isOrderAccepted) startPreparingOrder();
            // step 3- order rejected
            else alert('Sorry Restaurant couldn\'t accept your order. Returning funds with zomato shares');
        }).catch(err=>{
            console.error(err);
            alert('Something Went Wrong! Please try again later')
        })
})

// step 1 - check whether restaurant accepted order or not
function askRestaurantToAcceptOrReject(){
    // callback
    setTimeout(()=>{
        isOrderAccepted = confirm('Should restaurant accept your Order?');
        hasRestaurantSeenYourOrder = true;
        // console.log(isOrderAccepted);
    },1000)
}

// step 2 - check if restaurant has accepted order
function checkIfOrderAcceptedFromRestaurant(){
    // Promise - resolve/accept or reject
    return new Promise((resolve,reject)=>{
        restaurantTimer = setInterval(()=>{
            console.log('Checking if Order Accepted or Not');

            if(!hasRestaurantSeenYourOrder) return;

            if(isOrderAccepted) resolve(true);
            else resolve(false);

            clearInterval(restaurantTimer);
        },2000);  
    });
}

// start preparing
function startPreparingOrder() {
  Promise.all([
    updateOrderStatus(),
    updateMapView(),
    checkIfValetAssigned(),
    checkIfOrderDelivered()
  ])
  .then((res) => {
      console.log(res);
      setTimeout(() => {
        alert("How was your food? Rate your food and delivery partner");
      }, 2000);
    })
    .catch((err) => {
      console.error(err);
    });
}

// helper functions - pure functions (only does one work)
function updateOrderStatus() {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            document.getElementById("currentStatus")
            .innerText = isOrderDelivered?"Order Delivered Successfully" : "Preparing Your Order";
            resolve('Status Updated');
        },1500);
    })
}

function updateMapView() {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            document.getElementById("mapview").style.opacity = "1";
            resolve('Map Initialised');  
        },1000);
    });
}

function startSearchingForValets(){
    // Get all locations of nearby valets
    // sort the valets based on shortest path of restaurant to customer
    //  Select the valet with minimum distance and minimum order

    // step 1 get valet
    const valetsPromise = [];
    for(let i=0;i<5;i++){
        valetsPromise.push(getRandomDriver());
    }
    console.log(valetsPromise);
    Promise.any(valetsPromise)
    .then(selectedValet => {
        console.log('Selected a valet => ',selectedValet);
        isValetFound = true;
    })
    .catch(err=>{
        console.error(err);
    })
}

function getRandomDriver(){
    // Fake delay
    return new Promise((resolve,reject)=>{
        const timeout = Math.random()*1000;
        setTimeout(()=>{
            resolve('Valet - '+timeout);
        },timeout);
    })
}

function checkIfValetAssigned(){
    return new Promise((resolve,reject)=>{
        valetTimer = setInterval(()=>{
            console.log('Searching For Valet');
            if(isValetFound){
                updateValetDetails();
                resolve('Updated Valet Details');
                clearTimeout(valetTimer);
            }
        },1000);
    })
}

function updateValetDetails(){
    if(isValetFound){
        document.getElementById('finding-driver').classList.add('none');
        document.getElementById('found-driver').classList.remove('none');
        document.getElementById('call').classList.remove('none');
    }
}

function checkIfOrderDelivered(){
    return new Promise((resolve, reject) => {
      valetDeliveryTimer = setInterval(() => {
        console.log("Is Order Delivered by Valet?");
        if (isOrderDelivered) {
          resolve("Ordered Delivered");
          updateOrderStatus(); 
          clearTimeout(valetDeliveryTimer);
        }
      }, 1000);
    });
}

// promise.all -all operations are called parallels, one fails, all fails
// promise.allSettled - all operations are called, and waits for every promise to get Executed
// promise.any - rejects only if all promises reject, return the first promise resolved
// promise.race - returns the result of first settled promise, either resolve or reject