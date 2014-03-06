#YAML to RESX converter

###Overview
This program can be used to convert YAML to key-value pairs and then, to the RESX XML format.
However, this tool is generic and can be used to convert YAML to any specified format.


###Installation
1. git clone https://github.com/psarathi/YAMLConverter.git
2. Open the **converter.html** under the YAMLConverter directory

###Usage
1. Enter the YAML text to be converted in the box labeled as **YAML**
2. Enter the delimiter to be used between the object and its property. "." is the default e.g. foo.bar
3. Click on the **YAML -> KeyValue Pair** button and the keyvalue pairs will be displayed under the **KeyValue Pair** box
4. Enter the format to be used to generate the final result in the text box under the **KeyValue Pair -> Result** button.
The default format is **&lt;data name={key} xml:space="preserve"&gt; &lt;value&gt;{value}&lt;/value&gt;&lt;/data&gt;**. The {key} and {value}
will be replaced by the keys and values respectively generated in the previous step.
5. Click on the **KeyValue Pair -> Result** button and the result will be displayed under the **Conversion Result** box
6. Click to the **Copy Result** button to copy the result
7. Click the **Clear All** button to clear all text
