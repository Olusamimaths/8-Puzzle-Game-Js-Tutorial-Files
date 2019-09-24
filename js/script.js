
// select the list items
let ul = document.querySelectorAll('li');;
const letters= ["A", "B", "C", "D", "E", "F", "G", "H", ""]

function setUp() {
    fillGrid(ul, letters);
    setId(ul)

    state.content = getState(ul);
    state.dimension = getDimension(state);
    // set up the droppable and dragabble contents
    setDroppable(ul) ;
    setDraggable(ul);

    console.log("The state content", state.content)
    console.log("The state dimension", state.dimension)
    
}

const state = {}
state.content = letters;


/**
 * Getters
 */
const getState = (items) => {
    const content = [];
    items.forEach((item, i) => {
        content.push(item.innerText)
    });
    return content;
}

const getEmptyCell = () => {
    const emptyCellNumber = state.emptyCellIndex+1;
    const emptyCellRow = Math.ceil(emptyCellNumber/3);
    const emptyCellCol = 3 - (3 * emptyCellRow - emptyCellNumber);
    // emptyCellRow holds the actual row number the empty tile falls into in a 9-cell grid
    // the array index will be one less than its value. Same goes for emptyCellCol
    return [emptyCellRow-1, emptyCellCol-1]
}


const getDimension = (state) => {
    let j = 0;
    let arr = [];
    const {content} = state;
    for(let i = 0; i < 3; i++) {
        arr.push(content.slice(j, j+3));
        j+=3;
    }

    return arr;
}

/**
 * setters
*/
const setDroppable = (items) => {
    items.forEach((item, i) => {
        if(!item.innerText) {
            state.emptyCellIndex = i;
            item.setAttribute("ondrop", "drop_handler(event);");
            item.setAttribute("ondragover", "dragover_handler(event);");
            item.setAttribute("class", "empty");
            item.setAttribute("draggable", "false");
            item.setAttribute("ondragstart", "");
            item.setAttribute("ondragend", "")
        }
        return;
        
    })
}


const removeDroppable = (items) => {
    items.forEach((item) => {
        item.setAttribute("ondrop", "");
        item.setAttribute("ondragover", "");
        item.setAttribute("draggable", "false");
        item.setAttribute("ondragstart", "");
        item.setAttribute("ondragend", "");
    })
}

const setDraggable = (items) => {
    const [row, col] = getEmptyCell();

    let left, right, top, bottom = null;
    if(state.dimension[row][col-1]) left = state.dimension[row][col-1];
    if(state.dimension[row][col+1]) right = state.dimension[row][col+1];

    if(state.dimension[row-1] != undefined) top = state.dimension[row-1][col];
    if(state.dimension[row+1] != undefined) bottom = state.dimension[row+1][col];


    // make its right and left dragabble
    items.forEach(item => {
        if(item.innerText == top || 
            item.innerText == bottom || 
            item.innerText == right ||
            item.innerText == left) {
                item.setAttribute("draggable", "true");
                item.setAttribute("ondragstart", "dragstart_handler(event)");
                item.setAttribute("ondragend", "dragend_handler(event)")
            }
        
    })
}


// this function sets a unique id for each list item, in the form 'li0' to 'li8'
const setId = (items) => {
    for(let i = 0; i < items.length; i++) {
        items[i].setAttribute("id", `li${i}`)
    }
}

const isSolvable = (arr) => {
    let number_of_inv = 0;
    // get the number of inversions
    for(let i =0; i<arr.length; i++){
        // i picks the first element
        for(let j = i+1; j < arr.length; j++) {
            // check that an element exist and index i and j, then check that element at i > at j
            if((arr[i] && arr[j]) && arr[i] > arr[j]) number_of_inv++;
        }
    }
    // if the number of inversions is even
    // the puzzle is solvable
    return (number_of_inv % 2 == 0);
}

const isCorrect = (solution, content) => {
    if(JSON.stringify(solution) == JSON.stringify(content)) return true;
    return false;
}

const fillGrid = (items, letters) => {
    let shuffled = shuffle(letters);
    // shuffle the letters arraay until there is a combination that is solvable
    while(!isSolvable(shuffled)) {
        shuffled = shuffle(letters);
    }

    items.forEach((item, i) => {
        item.innerText = shuffled[i];
    })
}

// shuffle the array
const shuffle = (arr) => {
    const copy = [...arr];
    // loop over half or full of the array
    for(let i = 0; i < copy.length; i++) {
        // for each index,i pick a random index j 
        let j = parseInt(Math.random()*copy.length);
        // swap elements at i and j
        let temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }   
    return copy;
 }


/**
 * Drag and drop handlers
 */
const dragstart_handler = ev => {
    console.log("dragstart")
    ev.dataTransfer.setData("text/plain", ev.target.id)
    ev.dataTransfer.dropEffect = "move";
}

const dragover_handler = ev => {
    console.log("dragOver");
    ev.preventDefault();
}

const drop_handler = ev => {
    console.log("drag")
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const data = ev.dataTransfer.getData("text/plain");
    ev.target.innerText = document.getElementById(data).innerText;
    
    // once dropped, unempty the cell :)
    ev.target.classList.remove("empty")
    ev.target.setAttribute("ondrop", "");
    ev.target.setAttribute("ondragover", "");
    document.getElementById(data).innerText = "";

    // get new state
    state.content = getState(ul);
    // get new dimention from the state
    state.dimension = getDimension(state);
}

const dragend_handler = ev => {
  console.log("dragEnd");
  // Remove all of the drag data
  ev.dataTransfer.clearData();
  // remove all droppable attributes
  removeDroppable(document.querySelectorAll('li'));

  // set new droppable and draggable attributes
  setDroppable(document.querySelectorAll('li'));
  setDraggable(document.querySelectorAll('li'))

    // if correct
    if(isCorrect(letters, state.content)) {
        showModal();
    }
}

const showModal = () => {
    document.getElementById('message').innerText = "You Won!";
    document.getElementById('modal').classList.remove("hide");

}

const hideModal = () => {
    document.getElementById('modal').classList.add("hide");
}




