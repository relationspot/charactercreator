
function purgeHiddenLayers() {
  var section = document.querySelector('#content_1 .selected--option').classList[2].slice(9);
  var thumbsSVG = document.querySelectorAll('#content_1 .selected--option svg');
  var svg = document.querySelector('#svg1');
  var counter = thumbsSVG.length;
  var currentSVG;
  var layersList = [];
  var mutlilayerList = [];
  while (counter--) {
    layersList.push(thumbsSVG[counter].classList[1]);
  }
  layersList = replaceMultilayer(layersList);
  counter = layersList.length;
  while (counter--) {
    currentSVG = svg.querySelector('#' + layersList[counter]);
    if (currentSVG != null && currentSVG.style.opacity === '0') {
      svg.removeChild(currentSVG);
    }
  }
}

function showPupilObject(object, shape) {
  var pupils = object.querySelectorAll('.pupil');
  var shown = object.querySelectorAll('.pupil--' + shape);
  var counter = pupils.length;
  while (counter--) {
    // pupils[counter].style
    if (pupils[counter].classList.contains('pupil--' + shape)) {
      pupils[counter].style.opacity = 1;
    } else {
      pupils[counter].style.opacity = 0;
    }
  }
  return object;
}

function clearCharacter() {
    var svgContainer = document.querySelector('#svg1');
    var toBeRemovedList = document.querySelectorAll('#svg1 > g');
    var counter = toBeRemovedList.length;
    while (counter--) {
      if (toBeRemovedList[counter].id != 'male_silhouette' && toBeRemovedList[counter].id != 'female_silhouette') {
        svgContainer.removeChild(toBeRemovedList[counter]);
      }
    }
}

function resetCharacterTemplate() {
    var characterSVG = document.querySelector('#svg1');
    var elements = characterSVG.querySelectorAll('*');
    var elementsLength = elements.length;
    var elementsCounter = elementsLength;
    while (elementsCounter--) {
        if (elements[elementsCounter].style.opacity !== 0) {
            elements[elementsCounter].style.opactiy = "0";
            selements[elementsCounter].style.pointerEvents = 'none';
        }
    }
}

function findNextLayerInDom(item) {
  var sex = c.sex;
  var svgContainer = document.querySelector('#svg1');
  var nextLayerSibling = null;
  var layers;
  var amountLayers;
  var itemPosition;
  if (sex === 'm') {
    layers = window.layersMale;
  } else {
    layers = window.layersFemale;
  }
  amountLayers = layers.length;
  itemPosition = layers.indexOf(item);
  while (nextLayerSibling === null) {
    nextLayerSibling = svgContainer.querySelector('#' + layers[itemPosition + 1]);
    if (itemPosition > amountLayers) {
      return
    }
    ++itemPosition;
  }
  return nextLayerSibling;
}
