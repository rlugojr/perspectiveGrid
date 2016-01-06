/* Copyright (c) 2013-2015 The Tagspaces Authors. All rights reserved.
 * Use of this source code is governed by a AGPL3 license that
 * can be found in the LICENSE file. */
/* global define, Handlebars, isCordova  */
define(function(require, exports, module) {
  "use strict";

  var extensionTitle = "Grid"; // should be equal to the name in the bower.json
  var extensionID = "perspectiveGrid"; // ID must be equal to the directory name where the extension is located
  var extensionIcon = "fa fa-th"; // icon class from font awesome

  console.log("Loading " + extensionID);

  var TSCORE = require("tscore");

  var extensionDirectory = TSCORE.Config.getExtensionPath() + "/" + extensionID;
  var UI;
  var extensionLoaded;

  var init = function() {
    console.log("Initializing perspective " + extensionID);

    extensionLoaded = new Promise(function(resolve, reject) {
      require([
        extensionDirectory + '/perspectiveUI.js',
        "text!" + extensionDirectory + '/toolbar.html',
        "css!" + extensionDirectory + '/extension.css',
      ], function(extUI, toolbarTPL) {
        var toolbarTemplate = Handlebars.compile(toolbarTPL);
        UI = new extUI.ExtUI(extensionID);
        UI.buildUI(toolbarTemplate);
        platformTuning();
        if (isCordova) {
          TSCORE.reLayout();
        }
        try {
          $('#' + extensionID + 'Container [data-i18n]').i18n();
        } catch (err) {
          console.log("Failed translating extension");
        }
        resolve(true);
      });
    });
  };

  var platformTuning = function() {
    if (isCordova) {
      $("#" + extensionID + "IncludeSubDirsButton").hide();
    } else if (isChrome) {
      $('#' + extensionID + 'AddFileButton').hide();
      $('#' + extensionID + 'TagButton').hide();
      $('#' + extensionID + 'CopyMoveButton').hide();
      $('#' + extensionID + 'CreateDirectoryButton').hide();
    } else if (isFirefox) {
      $('#' + extensionID + 'AddFileButton').hide(); // Current impl has 0.5mb limit
    }
  };

  var load = function() {
    console.log("Loading perspective " + extensionID);
    extensionLoaded.then(function() {
      UI.reInit();
    }, function(err) {
      console.warn("Loading extension failed: " + err);
    });
  };

  var clearSelectedFiles = function() {
    if (UI) {
      UI.clearSelectedFiles();
      UI.handleElementActivation();
    }
  };

  var removeFileUI = function(filePath) {
    UI.removeFileUI(filePath);
  };

  var updateFileUI = function(oldFilePath, newFilePath) {
    UI.updateFileUI(oldFilePath, newFilePath);
  };

  var getNextFile = function(filePath) {
    return UI.getNextFile(filePath);
  };

  var getPrevFile = function(filePath) {
    return UI.getPrevFile(filePath);
  };

  // Vars
  exports.Title = extensionTitle;
  exports.ID = extensionID;
  exports.Icon = extensionIcon;

  // Methods
  exports.init = init;
  exports.load = load;
  exports.clearSelectedFiles = clearSelectedFiles;
  exports.getNextFile = getNextFile;
  exports.getPrevFile = getPrevFile;
  exports.removeFileUI = removeFileUI;
  exports.updateFileUI = updateFileUI;

});
