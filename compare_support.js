module.exports = function(RED) {
  function compare_supportNode(config) {
      RED.nodes.createNode(this,config);

      this.compare_select = config.compare_select;
      this.equalTo = config.equalTo;
      this.maxValue = config.maxValue;
      this.minValue = config.minValue;

      var node = this;
      
      node.on('input', function(msg) {

          let _compare = {};
          if (node.compare_select == "equalTo") {
            _compare = {
              command_value: {"==": (!isNaN(parseFloat(node.equalTo)))? parseFloat(node.equalTo):node.equalTo }
            }
          }
          if (node.compare_select == "interval") {
            _compare = {
              command_value: {">=": parseFloat(node.minValue), "<=": parseFloat(node.maxValue)}
            }
          }
          if (node.compare_select == "maxValue") {
            _compare = {
              command_value: {">=": null, "<=": parseFloat(node.maxValue)}
            }
          }
          if (node.compare_select == "minValue") {
            _compare = {
              command_value: {">=": parseFloat(node.minValue), "<=": null}
            }
          }


          var globalContext = node.context().global;
          // var exportMode = globalContext.get("exportMode");
          var currentMode = globalContext.get("currentMode");
          var command =  {
            type: "processing_modular_V1.0",
            slot: 1,
            compare: _compare,
            method: "compare_support",
            command_in: "",
            get_output: {
              command_in: "command_out"
            }
          }
          var file = globalContext.get("exportFile")
          var slot = globalContext.get("slot");
          if (currentMode == "test") {
            file.slots[slot].jig_test.push(command)
          }
          else { 
            file.slots[slot].jig_error.push(command)
          }
          globalContext.set("exportFile", file);
          node.status({fill:"green", shape:"dot", text:"done"}); // seta o status pra waiting
          // msg.payload = command
          console.log(command)
          node.send(msg);
      });
  }
  RED.nodes.registerType("compare_support", compare_supportNode);
}