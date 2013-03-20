checkOtherBox = function(self) {
  var name = self.name;
  var checked = self.checked;
  var inputs = document.querySelectorAll('input[name=' + name + ']');
  for (var i = 0; i<inputs.length; i++) {
    inputs[i].checked = self.checked;
  }
}