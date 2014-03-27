(function () {
    var OSName = "Unknown OS";
    if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
    var btnConvert = document.getElementById('jtoh');
    var btnClear = document.getElementById('clear');
    var btnFinish = document.getElementById('htor');
    var btnCopyResult = document.getElementById('copyResult');
    var txtSource = document.getElementById('source');
    var txtResult = document.getElementById('result');
    var txtFinalResult = document.getElementById('finalResult');
    var txtDelimiter = document.getElementById('delimiter');
    var txtTemplate = document.getElementById('template');
    var defaultTemplate = '<data name={key} xml:space="preserve"> <value>{value}</value></data>';
    var defaultDelimiter = '.';

    // Event Listeners
    btnConvert.addEventListener('click', function () {
        var sourceValue = txtSource.value;
        var sourceLines = sourceValue.split('\n');
        txtResult.value = converter.convert(sourceLines);
    });

    btnClear.addEventListener('click', function () {
        var inputs = document.getElementsByTagName('input');
        var textareas = document.getElementsByTagName('textarea');
        for (var i = inputs.length - 1; i >= 0; i--) {
            inputs[i].value = '';
        }
        ;
        for (var j = textareas.length - 1; j >= 0; j--) {
            textareas[j].value = '';
        }
        ;
    });

    btnFinish.addEventListener('click', function () {
        if (!txtResult.value.trim()) {
            return;
        }

        txtFinalResult.value = converter.convertToResx(txtResult.value.split('\n'));
    });

    btnCopyResult.addEventListener('click', function () {
        var copy = OSName === 'Windows' ? 'Ctrl+C' : 'Cmd+C',
            copyMessage = "Copy to clipboard: " + copy + ", Enter";
        window.prompt(copyMessage, txtFinalResult.value);
    });

    var converter = {
        convertToResx: function (linesToBeConverted) {
            var resxResult = [];
            for (var i = 0; i < linesToBeConverted.length; i++) {
                if (!linesToBeConverted[i].trim()) {
                    continue;
                }

                var keyValuePair = linesToBeConverted[i].split('=');
                var template = txtTemplate.value.trim() || defaultTemplate;
                resxResult.push(template.replace(/{key}/g, keyValuePair[0]).replace(/{value}/g, keyValuePair[1]).replace(/"/g, ''));
            }

            return resxResult.join('\n');
        },
        convert: function (yamlLines) {
            var tagTracker = [];
            var keyValueResult = [];
            var prefix = '';
            var setPrefix = function () {
                prefix = prefix ? prefix + delimiter + yamlProperty : yamlProperty;
            };
            var getKeyValuePair = function () {
                return prefix + '=' + propertyValue;
            };
            var delimiter = txtDelimiter.value.trim() || defaultDelimiter;

            for (var i = 0; i < yamlLines.length; i++) {
                var yamlLine = yamlLines[i];
                if (!yamlLine) continue;
                var leadingSpaceCount = this.getLeadingSpacesCount(yamlLine);
                var yamlProperty = this.getYAMLProperty(yamlLine);
                var propertyValue = this.getPropertyValue(yamlLine);
                var previousTag = tagTracker.length == 0 ? null : tagTracker[tagTracker.length - 1];
                propertyValue = yamlLine.replace(yamlProperty + ":", '').trim();
                prefix = prefix || '';


                if (!previousTag) {
                    tagTracker.push({
                        'tag': prefix + yamlProperty,
                        'space': leadingSpaceCount
                    });

                    setPrefix();
                    if (!propertyValue) {
                        continue;
                    }

                    keyValueResult.push(getKeyValuePair());
                    continue;
                }

                if (leadingSpaceCount > previousTag.space) {
                    // Child
                    tagTracker.push({
                        'tag': prefix + yamlProperty,
                        'space': leadingSpaceCount
                    });

                    setPrefix();
                    if (!propertyValue) {
                        continue;
                    }

                    keyValueResult.push(getKeyValuePair());
                    continue;

                }
                if (leadingSpaceCount == previousTag.space) {
                    // Sibling
                    tagTracker.pop();
                    prefix = prefix.substring(0, prefix.lastIndexOf(delimiter));
                    tagTracker.push({
                        'tag': prefix + yamlProperty,
                        'space': leadingSpaceCount
                    });

                    setPrefix();
                    if (!propertyValue) {
                        continue;
                    }

                    keyValueResult.push(getKeyValuePair());
                    continue;
                }
                if (leadingSpaceCount < previousTag.space) {
                    // Parent
                    var tagCountSearch = leadingSpaceCount;
                    var trackerLength = tagTracker.length;
                    while (tagCountSearch !== tagTracker[trackerLength - 1].space) {
                        tagTracker.pop();
                        trackerLength--;
                        prefix = prefix.substring(0, prefix.lastIndexOf(delimiter));
                    }
                    if (prefix.indexOf(delimiter) == -1) {
                        prefix = '';
                    }else{
                        prefix = prefix.substring(0, prefix.lastIndexOf(delimiter));
                    }
                    tagTracker.pop();
                    tagTracker.push({
                        'tag': yamlProperty,
                        'space': leadingSpaceCount
                    });

                    setPrefix();
                    if (!propertyValue) {
                        keyValueResult.push("");
                        continue;
                    }

                    keyValueResult.push(getKeyValuePair());
                }
            }
            return keyValueResult.join('\n');
        },
        getPropertyValue: function (yamlLine) {
            return yamlLine.substring(yamlLine.indexOf(':'));
        },
        getLeadingSpacesCount: function (yamlLine) {
            var matches = /^[\s\t\r\n]+/.exec(yamlLine);
            if (!matches) return 0;
            return matches[0].length;
        },
        getYAMLProperty: function (yamlLine) {
            var tag = yamlLine.substring(0, yamlLine.indexOf(':'));
            return tag ? tag.trim() : '';
        }
    };
})();