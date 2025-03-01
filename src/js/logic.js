
// Change sex of character from male to female or vice versa.
function trans(sex){
    if (c.sex === sex) {return}
    var characterSVG = document.querySelector('#svg1');
    characterSVG.classList.add('character--hide');
    hash.add({ sex: sex });
    hash.add({ emotion: 'neutral' }); // Female and Male templates have different set of emotions at this time.
    // ^ Should really check to see if the emotion doesn't exist before forcing a change to neutral.
    if (currentUser && currentUser.cc && currentUser.cc.personnages && currentUser.personnageActuel) {
         currentUser.cc.personnages[personnageActuel].sex = sex;
    }
    window.sex = sex;
    buildCharacter(resetForms);
}

// TODO change setTimeout to promises.
function buildCharacter(callback) {
    var characterSVG = document.querySelector('#svg1');
    setTimeout(function(){
        zoomFull();
        clearForms();
        clearCharacter();
        interpretHash();
        setTimeout(function(){
            characterSVG.classList.remove('character--hide');
            callback();
        },500);
    },500);
}

function hideForms() {
    hideSidebarLeft();
    hideSidebarRight();
}

function clearForms() {
    clearSidebarLeft();
    clearSidebarRight();
}

function resetForms() {
    hideForms();
    //TODO The following function should be a callback or a response to a promise.
    createForm();
    showSidebarLeft();
}

function Character(choices){
    this.choices = choices || {
        emotion : 'neutral',
        body : 'athletic', // Or 'default' or 'veiny'.
        eyeballs : 'default',
        skinColor : this.skinTone, //'#ffd5d5', // Or some random skin color from
        hairColor : '#ffe680', // Or random from list of hair colors',
        irisColor : '#2ad4ff', // Or some random eye color
        underwear : 'plain', // or random, whatever.
        underwearColor : '#f2f2f2', // Or random from a list of fabrics',
    };
    this.choices.emotion = this.choices.emotion || 'neutral';
    this.choices.body = this.choices.body || 'athletic';
    //this.choices.lips = this.choices.lips || 'default';
    if (this.skinTone) {
        this.choices.skinColor = this.skinTone;
    }
    this.choices.hairColor = this.choices.hairColor || '#ffe680';
    this.choices.irisColor = this.choices.irisColor || '#2ad4ff';
    this.choices.underwear = this.choices.underwear || 'plain';
    this.choices.underwearColor = this.choices.underwearColor || '#f2f2f2';

    choices = this.choices;
    if (!choices.body_head) {
        choices.body_head = 'default';
    }
    if (!choices.ears) {
        choices.ears = 'default';
    }
    if (!choices.nose) {
        choices.nose = 'default';
    }
};

function modCharacter(myKey, myValue){
    // look in c.choices to see if the key is already there
    if (myKey in c.choices){
        delete c.choices[myKey];
    };
    if (myKey === "brows" || myKey ==="eyes" || myKey ==="lashes" || myKey ==="sockets" || myKey === "mouth") {
      return;
    }
    // If there, modify the value
    // if not, add it in, with the value
    // if the value is '', then delete the key from the object,
    if (myValue != ''){
        c.choices[myKey] = myValue;
    };
    if (currentUser && currentUser.cc && currentUser.cc.personnages && currentUser.cc.personnageActuel) {
        currentUser.cc.personnages[currentUser.cc.personnageActuel][myKey] = myValue;
    }
};

function createCharacter() {
    document.getElementById(sex+"Button").checked=true;
    //Draw the essential stuff
    //Draw stuff from the hash
    var forms = [form1, form2, form3];
    for (var lot in forms){
        for(var x in forms[lot]){
            var sectionTitle = x;
            var t = sectionTitle.toLowerCase();
            var xsel = hash.get(t);
            if (xsel !== undefined) {
                var id = '#' + t +'_'+xsel
                for (lyr in multiLayer){
                    if (id.slice(1) == multiLayer[lyr][0]){
                        for (var i=1;i<=multiLayer[lyr][1];i++){
                            idOf = id + '_' + i + '_of_' + multiLayer[lyr][1];
                            viewport.selectAll(idOf).attr({
                                opacity:1
                            });
                        }
                    }
                    else {
                        viewport.selectAll(id).attr({
                            opacity:1
                        });
                    }
                };
            }
        }
    };
};

function GetEmotionGetLayers(option) {
    var facialExpressionLayers = [];
    var modElement = '';
    faceElements = ['brows', 'eyes', 'mouth', 'lashes', 'sockets'];
    for (e in faceElements) {
        var eLayer = faceElements[e];
        facialExpressionLayers.push(eLayer);
    };
    return facialExpressionLayers;
};

function getOptions (section) {
    var forms = window.forms;
    var section = capitalizeFirstLetter(section);
    for (i in forms){
        options = forms[i][section];
        if (options != undefined){
        return options
        }
    }
}

function show(userChoice, category) {
    if (typeof(category) === "string") {
        var sections = [category];
    } else {
        var sections = [category.split(" ")[1]];
    };
    var selectedOption = userChoice;
    var options = getOptions(sections[0])
    var obj = new Array();
    var id = '#'+sections[0]+'_'+selectedOption;
    obj[category] = userChoice;
    if (userChoice === '') {
      modCharacter(category, userChoice);
      hash.remove(category);
    } else {
      modCharacter(category, userChoice);
      hash.add(obj);
    }
    if (currentUser) {
        triggerSaveBtn();
    }
    if (sections[0] === 'emotion'){
        modCharacter(sections[0], selectedOption);
        ga('send', 'event', 'menu', 'select', id);
        sections = []; //Reset the sections layer so it doesn't contain 'emotion', as it isn't a layer in itself.
        var emotions = GetEmotionGetLayers(selectedOption);
        for (emo in emotions){
            var newEmo = emotions[emo];
            sections.push(newEmo);
        }
    };
    displaySections(sections, options, selectedOption, multiLayer);
}

function displaySections(sections, options, selectedOption, multiLayer) {
    for (section in sections){
        options.forEach(function(d, i){
            var id = '#'+sections[section]+'_'+d;
            if(selectedOption != '' && d === selectedOption){
                sectionShow(multiLayer, id);

                if (sections[section] === 'brows'||sections[section] === 'eyes'||sections[section] === 'mouth'||sections[section] === 'lashes'||sections[section] === 'sockets'){
                    modCharacter(sections[section], selectedOption);
                } else {
                    var obj = new Array();
                    obj[sections[section]] = selectedOption;
                    hash.add(obj);
                    modCharacter(sections[section], selectedOption);
                    ga('send', 'event', 'menu', 'select', id);
                }
            }
            else {
                for (lyr in multiLayer){
                    sectionHide(multiLayer, id);
                };
            };
        });
    };
}

function sectionShow(multiLayer, id) {
  // console.log('sectionShow multilayer',multilayer);
  var pupilShape;
  var svgContainer = document.querySelector('#svg1');
  var isMultiLayered = false;

  if (id === "#iris_default") {return};

  for (lyr in multiLayer){
    if (id.slice(1) === multiLayer[lyr][0]){
      isMultiLayered = true;
      break;
    }
  }

  if (id.slice(1, 7) === 'pupils'){
    pupilShape = id.slice(1).split('_')[1];
    showPupils(pupilShape);
  } else if (id.slice(1,5) === "body" && id.slice(6,10) != 'head'){
      // For male template do this.
      // Necessary because of the introduction of modular body parts.
      if (c.sex === 'm') {
        var idList = id.split('_');
        var bodySuffix = idList[idList.length-1];
        var bodyLayers = [];
        var bodyLayersCounter;
        // bodyLayers.push('body_hand_right');
        // bodyLayers.push('body_hand_left');
        bodyLayers.push('body_torso_' + bodySuffix);
        bodyLayers.push('body_arm_right_' + bodySuffix);
        bodyLayers.push('body_arm_left_' + bodySuffix);
        bodyLayers.push('body_forearm_right_' + bodySuffix);
        bodyLayers.push('body_forearm_left_' + bodySuffix);
        bodyLayers.push('body_leg_right_' + bodySuffix);
        bodyLayers.push('body_leg_left_' + bodySuffix);
        // bodyLayers.push('body_foot_right');
        // bodyLayers.push('body_foot_left');

        bodyLayersCounter = bodyLayers.length;
        while (bodyLayersCounter--) {
          idOf = '#' + bodyLayers[bodyLayersCounter];
          svgContainer.querySelector(idOf).style.opacity = 1;
          svgContainer.querySelector(idOf).style.pointerEvents = 'auto';
        }
      } else {
        // if female template do this
        for (var i = 1;i <= multiLayer[lyr][1]; i++){
            idOf = id + '_' + i + '_of_' + multiLayer[lyr][1];
            svgContainer.querySelector(idOf).style.opacity = 1;
            svgContainer.querySelector(idOf).style.pointerEvents = 'auto';
        }
      }
  } else {
      svgContainer.querySelector(id).style.opacity = 1;
      svgContainer.querySelector(id).style.pointerEvents = 'auto';
  }
  if (id.slice(1).split('_')[0] === 'eyes') {
    changeClipPathOnEyes(id);
  }
}

function showPupils(pupilShape) {
  var svg = document.querySelector('#svg1');
  var pupils = svg.querySelectorAll('.pupil');
  var counter = pupils.length;
  while (counter--) {
    if (pupils[counter].classList.contains('pupil--' + pupilShape)) {
      pupils[counter].style.opacity = 1;
      pupils[counter].style.pointerEvents = 'auto';
    } else {
      pupils[counter].style.opacity = 0;
      pupils[counter].style.pointerEvents = 'none';
    }
  }
}

function sectionHide(multiLayer, id) {
  var svgContainer = document.querySelector('#svg1');
  var sectionToHide;
    if (id.slice(1) == multiLayer[lyr][0]) {
        for (var i=1;i<=multiLayer[lyr][1];i++) {
            idOf = id + '_' + i + '_of_' + multiLayer[lyr][1];
            sectionToHide = svgContainer.querySelector(idOf);
            if (sectionToHide != null) {
              sectionToHide.style.opacity = 0;
              sectionToHide.style.pointerEvents = 'none';
            }
        }
    } else if (id.slice(1,5) === "body" && id.slice(6,10) != 'head' ){

        // For male template do this.
        // Necessary because of the introduction of modular body parts.
        if (c.sex === 'm') {
          var idList = id.split('_');
          var bodySuffix = idList[idList.length-1];
          var bodyLayers = [];
          var bodyLayersCounter;
          // bodyLayers.push('body_hand_right');
          // bodyLayers.push('body_hand_left');
          bodyLayers.push('body_torso_' + bodySuffix);
          bodyLayers.push('body_arm_right_' + bodySuffix);
          bodyLayers.push('body_arm_left_' + bodySuffix);
          bodyLayers.push('body_forearm_right_' + bodySuffix);
          bodyLayers.push('body_forearm_left_' + bodySuffix);
          bodyLayers.push('body_leg_right_' + bodySuffix);
          bodyLayers.push('body_leg_left_' + bodySuffix);
          // bodyLayers.push('body_foot_right');
          // bodyLayers.push('body_foot_left');

          bodyLayersCounter = bodyLayers.length;
          while (bodyLayersCounter--) {
            idOf = '#' + bodyLayers[bodyLayersCounter];
            svgContainer.querySelector(idOf).style.opacity = 0;
            svgContainer.querySelector(idOf).style.pointerEvents = 'none';
          }
        } else {
          // if female template do this
          for (var i = 1;i <= multiLayer[lyr][1]; i++){
              idOf = id + '_' + i + '_of_' + multiLayer[lyr][1];
              svgContainer.querySelector(idOf).style.opacity = 0;
              svgContainer.querySelector(idOf).style.pointerEvents = 'none';
          }
        }
    } else {
        sectionToHide = svgContainer.querySelector(id);
        if (sectionToHide != null) {
          sectionToHide.style.opacity = 0;
          sectionToHide.style.pointerEvents = 'none';
        }
    };
}
