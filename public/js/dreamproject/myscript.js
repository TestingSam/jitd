$("#CreateUIBlock").on("click", () => {
  vex.dialog.prompt({
    message: "Please enter the UI Block Name...",
    placeholder: "name",
    callback: function(uiBlock) {
      console.log(uiBlock);
      if (uiBlock != false) {
        $.ajax({
          url: "http://127.0.0.1:5000/getPresenceOfComponent",
          type: "POST",
          data: {
            uiBlockName: JSON.stringify(uiBlock),
            gridPresence: false
          },
          success: function(result) {
            console.log("Check Presence of...");
            console.log(result);
            if (result) {
              $.ajax({
                url: "http://127.0.0.1:5000/uiblockmetadata",
                type: "POST",
                data: {
                  uiBlockName: JSON.stringify(uiBlock),
                  gridPresence: true
                },
                success: function(result) {
                  console.log(result);
                  window.location.href = "/createuiblock?uiBlockName=" + result;
                  /*if (result.length != 0 || result.length == 5)
                    window.location.href = "/createuiblock";
                  else {
                    bootoast.toast({
                      message: "Component already present...",
                      position: "bottom-right"
                    });
                  }*/
                }
              });
            } else {
              $.ajax({
                url: "http://127.0.0.1:5000/uiblockmetadata",
                type: "POST",
                data: {
                  uiBlockName: JSON.stringify(uiBlock),
                  gridPresence: false
                },
                success: function(result) {
                  console.log(result);
                  window.location.href = "/createuiblock?uiBlockName=" + result;
                  /*if (result.length != 0 || result.length == 5)
                    window.location.href = "/createuiblock";
                  else {
                    bootoast.toast({
                      message: "Component already present...",
                      position: "bottom-right"
                    });
                  }*/
                }
              });
            }
            /*if (result.length != 0 || result.length == 5)
              window.location.href = "/createuiblock";
            else {
              bootoast.toast({
                message: "Component already present...",
                position: "bottom-right"
              });
            }*/
          }
        });
      } else {
        bootoast.toast({
          message: "Component name not entered...",
          type: "danger",
          position: "bottom-right"
        });
      }
    }
  });
});
