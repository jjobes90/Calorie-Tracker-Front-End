// getting all required elements
const searchWrapper = document.querySelector(".search-input");
const inputBox = document.querySelector("input");
const suggBox = document.querySelector(".autocom-box");

let servingSize = document.querySelector("#serving-size");
let calories = document.querySelector("#calories-input");
let protein = document.querySelector("#protein-input");
// let fat = document.querySelector("#api-fat");
// let carbs = document.querySelector("#api-carbs");

// define function to get food suggestions
let foodObjectFromAPI = function() {

        // if user press any key and release
        inputBox.onkeyup = (e)=>{
            let userData = e.target.value; //user enetered data

            const params = {
            api_key: 'LvKC4sXNhZef7t4dagLTaRrcTWtgUNFx41yLVB26',
            query: userData,
            dataType: ["Survey (FNDDS)"],
            pageSize: '10000'
        }

            fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(params.query)}&pageSize=${encodeURIComponent(params.pageSize)}&api_key=${encodeURIComponent(params.api_key)}&dataType=${encodeURIComponent(params.dataType)}`)
                .then(response => response.json())
                .then(

                    function(json) {

                        // assign repsonse object to variable
                        jsonData = json.foods;

                        // loop through object to extract suggestions
                        let suggestions = [];

                        jsonData.forEach(item => {
                            suggestions.push(item.description);
                        })

                        let emptyArray = [];

                        if(userData) {

                            emptyArray = suggestions.filter((data)=>{
                                //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
                                return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
                            });

                            emptyArray = emptyArray.map((data)=>{
                                // passing return data inside li tag
                                return data = `<li>${data}</li>`;
                            });

                            searchWrapper.classList.add("active"); //show autocomplete box
                            showSuggestions(emptyArray);
                            let allList = suggBox.querySelectorAll("li");
                            for (let i = 0; i < allList.length; i++) {

                                //adding onclick attribute in all li tag
                                //allList[i].setAttribute("onclick", `inputBox.value = this.textContent; searchWrapper.classList.remove("active");`);

                                allList[i].addEventListener("click", function() {

                                    // add food item description to input box
                                    inputBox.value = allList[i].textContent;

                                    // remove suggestions list
                                    searchWrapper.classList.remove("active");

                                    // add values to page:
                                    // serving size
                                    servingSize.innerHTML = json.foods[i].foodMeasures[0].disseminationText;

                                    console.log(servingSize);

                                    // calories
                                    calories.innerHTML = json.foods[i].foodNutrients[3].value + " calories";

                                    // protein
                                    protein.innerHTML = json.foods[i].foodNutrients[0].value + " grams protein";

                                    // fat
                                    fat.innerHTML = json.foods[i].foodNutrients[1].value + " grams fat";

                                    // carbs
                                    carbs.innerHTML = json.foods[i].foodNutrients[2].value + " grams carbs";

                                })
                        }

                        } else {
                            searchWrapper.classList.remove("active"); //hide autocomplete box
                        }

                        function showSuggestions(list) {
                            let listData;
                            if(!list.length){
                                userValue = inputBox.value;
                                listData = `<li>${userValue}</li>`;
                            }else{
                            listData = list.join('');
                            }
                            suggBox.innerHTML = listData;
                        }
                    }
                )
        }
}();