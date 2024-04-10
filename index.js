const formElements = [
  {
    id: "c0ac49c5-871e-4c72-a878-251de465e6b4",
    type: "input",
    label: "Sample Label",
    placeholder: "Sample placeholder",
  },
  {
    id: "146e69c2-1630-4a27-9d0b-f09e463a66e4",
    type: "select",
    label: "Sample Label",
    options: ["Sample Option 1", "Sample Option 2", "Sample Option 3"],
  },
  {
    id: "45002ecf-85cf-4852-bc46-529f94a758f5",
    type: "input",
    label: "Sample Label",
    placeholder: "Sample Placeholder",
  },
  {
    id: "680cff8d-c7f9-40be-8767-e3d6ba420952",
    type: "textarea",
    label: "Sample Label",
    placeholder: "Sample Placeholder",
  },
];

function renderForm() {
  const formBuilder = document.getElementById("form-builder");
  formBuilder.innerHTML = "";

  formElements.forEach((element, index) => {
    let formElement = document.createElement("div");
    formElement.classList.add("form-element");
    formElement.setAttribute("draggable", true);
    formElement.setAttribute("data-index", index);

    formElement.addEventListener("dragstart", handleDragStart, false);
    formElement.addEventListener("dragover", handleDragOver, false);
    formElement.addEventListener("drop", handleDrop, false);

    let label = document.createElement("label");
    label.textContent = element.label;
    switch (element.type) {
      case "input":
        label.textContent = element.label;
        break;
      case "select":
        label.textContent = `Select`;
        break;
      case "textarea":
        label.textContent = `Text area`;
        break;
    }
    formElement.appendChild(label);

    addFormControls(element, formElement);

    formBuilder.appendChild(formElement);
  });

  document.getElementById("save-form").addEventListener("click", function () {
    console.log(JSON.stringify(formElements, null, 2));
  });
}

function addNewElement(type) {
  const newElement = {
    id: generateUUID(),
    type: type,
    label: type.charAt(0).toUpperCase() + type.slice(1) + " Label",
    placeholder: "Sample Placeholder",
  };

  if (type === "select") {
    newElement.options = ["Option 1", "Option 2", "Option 3"];
  }

  formElements.push(newElement);
  renderForm();
}

document.getElementById("addInput").addEventListener("click", function () {
  console.log("func called");
  addNewElement("input");
});

document.getElementById("addSelect").addEventListener("click", function () {
  addNewElement("select");
});

document.getElementById("addTextarea").addEventListener("click", function () {
  addNewElement("textarea");
});

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let draggedIndex = -1;

function handleDragStart(e) {
  draggedIndex = parseInt(e.target.getAttribute("data-index"), 10);
  e.dataTransfer.effectAllowed = "move";
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function handleDrop(e) {
  e.stopPropagation();
  e.preventDefault();

  const targetIndex = parseInt(e.target.getAttribute("data-index"), 10);
  if (draggedIndex !== targetIndex) {
    const itemToMove = formElements.splice(draggedIndex, 1)[0];
    formElements.splice(targetIndex, 0, itemToMove);

    renderForm();
  }

  return false;
}
function addFormControls(element, parentElement) {
  let label = parentElement.querySelector("label");

  label.contentEditable = true;
  label.onblur = function () {
    element.label = label.textContent.replace(/^(Input|Select|Textarea): /, "");
  };

  switch (element.type) {
    case "input":
      let input = document.createElement("input");
      input.placeholder = element.placeholder;
      input.oninput = function () {
        element.placeholder = input.placeholder;
      };
      parentElement.appendChild(input);
      break;
    case "select":
      let select = document.createElement("select");
      element.options.forEach((option, index) => {
        let optionElement = document.createElement("option");
        optionElement.textContent = option;
        select.appendChild(optionElement);

        optionElement.ondblclick = function () {
          element.options.splice(index, 1);
          renderForm();
        };
      });

      let addOptionBtn = document.createElement("button");
      addOptionBtn.textContent = "+";
      addOptionBtn.classList.add("addOptionBtn");
      addOptionBtn.onclick = function () {
        element.options.push("New Option");
        renderForm();
      };
      let deleteOptionBtn = document.createElement("button");
      deleteOptionBtn.classList.add("deleteOptionBtn");
      deleteOptionBtn.textContent = "-";
      deleteOptionBtn.onclick = function () {
        element.options.pop();
        renderForm();
      };
      parentElement.appendChild(select);
      parentElement.append(deleteOptionBtn, addOptionBtn);
      break;
    case "textarea":
      let textarea = document.createElement("textarea");
      textarea.placeholder = element.placeholder;
      textarea.oninput = function () {
        element.placeholder = textarea.placeholder;
      };
      parentElement.appendChild(textarea);
      break;
  }
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.className = "delete-button";
  deleteButton.onclick = function () {
    formElements.splice(parentElement.getAttribute("data-index"), 1);
    renderForm();
  };
  parentElement.appendChild(deleteButton);
}

renderForm();
