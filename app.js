// Storage controller
const StorageCtrl = (function() {
    // public methods
    return {
        storeItem: function(item) {
            let items;

            // check if any items in local storage
            if(localStorage.getItem('items') === null) {
                items = [];
                // push new item
                items.push(item);
                // set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // get what is already in local storage
                items = JSON.parse(localStorage.getItem('items'));

                // push new item
                items.push(item);

                // re-set ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage : function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            
            items.forEach(function(item, index){
                if(id === item.id){
                items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
            },
            clearItemsFromStorage: function(){
            localStorage.removeItem('items');
            }
    }
})();

// Item controller
const ItemCtrl = (function() {
    // Item constructor
    const Item = function(id, name, calories, protein) {
        this.id = id;
        this.name = name;
        this.calories = calories;
        this.protein = protein;
    }

        // Date Structure / State
        const data = {
            // items: [
            //     // {id: 0, name: 'Steak Dinner', calories: 1200, protein: 70},
            //     // {id: 1, name: 'Cookie', calories: 200, protein: 5},
            //     // {id: 2, name: 'Egg', calories: 120, protein: 6}

            // ],
            items: StorageCtrl.getItemsFromStorage(),
            currentItem: null,
            totalCalories: 0,
            totalProtein: 0
        }
        // Public methods
        return {
            getItems: function() {
                return data.items;
            },
            addItem: function(name, calories, protein) {
                let ID;
                // create id
                if(data.items.length > 0) {
                    ID = data.items[data.items.length - 1].id + 1
                } else {
                    ID = 0;
                }

                // calories to number
                calories = parseInt(calories);
                protein = parseInt(protein);

                // create new item
                newItem = new Item(ID, name, calories, protein);
                
                // add new items to items array
                data.items.push(newItem);

                return newItem;

            },
            getItemById: function(id) {
                let found = null;

                // loop through items
                data.items.forEach(function(item) {
                    if(item.id === id) {
                        found = item;
                    }
                })
                return found;
            },
            updateItem: function(name, calories, protein) {
                // calories to number
                calories = parseInt(calories);
                protein = parseInt(protein);

                let found = null;
                data.items.forEach(function(item) {
                    if(item.id === data.currentItem.id) {
                        item.name = name;
                        item.calories = calories;
                        item.protein = protein;
                        found = item;
                    }
                });
                return found;
            },
            deleteItem: function(id){
                // get id's
                const ids = data.items.map(function(item){
                    return item.id;
                });
                // get index
                const index = ids.indexOf(id);
                // remove item
                data.items.splice(index, 1);

            },
            clearAllItems: function() {
                data.items = [];
            },
            setCurrentItem: function(item) {
                data.currentItem = item;
            },
            getCurrentItem: function() {
                return data.currentItem;
            },
            getTotalCalories: function() {
                let total = 0;

                // loop through items and add calories
                data.items.forEach(function(item) {
                    total += item.calories;
                });

                // set total to in data structure
                data.totalCalories = total;

                return data.totalCalories;
            },
            getTotalProtein: function() {
                let total = 0;

                // loop through items and add calories
                data.items.forEach(function(item) {
                    total += item.protein;
                });

                // set total to in data structure
                data.totalProtein = total;

                return data.totalProtein;
            },
            
            logData: function(){
                return data;
            }
        }
})();

// UI Controller
const UICtrl = (function() {

    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        itemProteinInput: '#item-protein',
        totalCalories: '.total-calories',
        totalProtein: '.total-protein',
        updateBtn: '.update-btn',
        backBtn: '.back-btn',
        deleteBtn: '.delete-btn',
        listItems: '#item-list li',
        clearBtn: '#clear-btn'
    }

    // Public methods
    return {
        populateItemList: function(items) {
            let html = '';

            items.forEach(function(item) {
                html += `
                    <li class="list-group-item collection-item d-flex align-items-start" id="item-${item.id}">
                        <div class="me-auto fw-bold">
                            ${item.name}
                        </div>
                        <div class="me-auto">
                            <em>${item.calories} calories</em>
                        </div>
                        <div class="me-auto">
                            <em>${item.protein} grams (protein)</em>
                        </div>
                        <a href="#" class="secondary-content">
                            <span class="badge edit-item bg bg-secondary rounded-pill">Edit</span>
                        </a>
                    </li>`;
            });

            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
                protein: document.querySelector(UISelectors.itemProteinInput).value
            }
        },
        addListItem: function(item){
            // show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create li element
            const li = document.createElement('li') 
            // add class
            li.className = 'list-group-item collection-item d-flex align-items-start';
            // add id
            li.id = `item-${item.id}`;
            // add html
            li.innerHTML = `
                <div class="me-auto fw-bold">
                    ${item.name}
                </div>
                <div class="me-auto">
                    <em>${item.calories} calories</em>
                </div>
                <div class="me-auto">
                    <em>${item.protein} grams (protein)</em>
                </div>
                <a href="#" class="secondary-content">
                    <span class="badge edit-item bg bg-secondary rounded-pill">Edit</span>
                </a>
            `;
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                <div class="me-auto fw-bold">
                    ${item.name}
                </div>
                <div class="me-auto">
                    <em>${item.calories} calories</em>
                </div>
                <div class="me-auto">
                    <em>${item.protein} grams (protein)</em>
                </div>
                <a href="#" class="secondary-content">
                    <span class="badge edit-item bg bg-secondary rounded-pill">Edit</span>
                </a>
                </div>`;
                }
            })
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
            document.querySelector(UISelectors.itemProteinInput).value = '';
        },
        addItemToForm: function(){

            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;

            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            document.querySelector(UISelectors.itemProteinInput).value = ItemCtrl.getCurrentItem().protein;

            UICtrl.showEditState()
        },
        removeItems : function() {
            let listItems = document.querySelectorAll(UISelectors.listItems)

            // turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item) {
                item.remove();
            })
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCals) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCals;
        },
        showTotalProtein: function(totalProt) {
            document.querySelector(UISelectors.totalProtein).textContent = totalProt;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {

    // load event listeners
    const loadEventListeners = function() {
        // get ui selectors
        const UISelectors = UICtrl.getSelectors();

        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // disable enter on submit
        document.addEventListener('keypress', function(e) {
            if(e.key === "Enter") {
                e.preventDefault();
                return false;
            }
        });

        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // delete button event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        
        // clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

        }
        // add item submit
        const itemAddSubmit = function(e) {

            // get form input from ui controller
            const input = UICtrl.getItemInput();

            // check for blank inputs
            if(input.name !== '' && input.calories !== '' && input.calories !== '') {

                // add item
                const newItem = ItemCtrl.addItem(input.name, input.calories, input.protein);

                // add item to UI list
                UICtrl.addListItem(newItem);

                // get total calories + protein
                const totalCalories = ItemCtrl.getTotalCalories();
                const totalProtein = ItemCtrl.getTotalProtein();

                // show totals to ui
                UICtrl.showTotalCalories(totalCalories);
                UICtrl.showTotalProtein(totalProtein);

                // store in local storage
                StorageCtrl.storeItem(newItem);

                // clear fields
                UICtrl.clearInput();
            }

            e.preventDefault();
        }

    // update edit item
    const itemEditClick = function(e) {

        if(e.target.classList.contains('edit-item')) {

            // get list item id (item-0) (item-1) ect...
             const listId = e.target.parentNode.parentNode.id;

             // break into array (split at dash)
             const listIdArray = listId.split('-');

             // get the id as a number
             const id = parseInt(listIdArray[1]);

             // get entire item object
             const itemToEdit = ItemCtrl.getItemById(id);

             // set item
             ItemCtrl.setCurrentItem(itemToEdit);

             // add item to form
             UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // update item submit
    const itemUpdateSubmit = function(e) {
        
        //get item input
        const input = UICtrl.getItemInput();

        // update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories, input.protein)

        // update UI
        UICtrl.updateListItem(updatedItem);

        // get total calories + protein
        const totalCalories = ItemCtrl.getTotalCalories();
        const totalProtein = ItemCtrl.getTotalProtein();

        // show totals to ui
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.showTotalProtein(totalProtein);

        // update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // delete button event
    const itemDeleteSubmit = function(e) {

        // get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // delete from structure
        ItemCtrl.deleteItem(currentItem.id)

        // delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // get total calories + protein
        const totalCalories = ItemCtrl.getTotalCalories();
        const totalProtein = ItemCtrl.getTotalProtein();

        // show totals
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.showTotalProtein(totalProtein);

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        // clear edit state
        UICtrl.clearEditState();

        e.preventDefault();
    }   
    // clear all items button
    const clearAllItemsClick = function() {
        // clear all items from list
        ItemCtrl.clearAllItems();

        // get total calories + protein
        const totalCalories = ItemCtrl.getTotalCalories();
        const totalProtein = ItemCtrl.getTotalProtein();

        // show totals
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.showTotalProtein(totalProtein);

        // clear edit state
        UICtrl.removeItems();

        // Clear from local storage
        StorageCtrl.clearItemsFromStorage();

        // hide ul
        UICtrl.hideList();
        
    }
    
    
    return {
        init: function() {
            // clear edit states
            UICtrl.clearEditState();

            // fetch items from data structure
            const items = ItemCtrl.getItems();

            // check if any items 
            if(items.length === 0) {
                UICtrl.hideList();
            } else {

                // populate list with items
                UICtrl.populateItemList(items);
            }
            // get total calories + protein
                const totalCalories = ItemCtrl.getTotalCalories();
                const totalProtein = ItemCtrl.getTotalProtein();

            // show totals
            UICtrl.showTotalCalories(totalCalories);
            UICtrl.showTotalProtein(totalProtein);

            // load event listeners
            loadEventListeners();

        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize app
App.init();