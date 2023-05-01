async function buildFabricsTable(fabricsTable, fabricsTableHeader, token, message) {
  try {
    const response = await fetch("/api/v1/fabrics", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    var children = [fabricsTableHeader];
    if (response.status === 200) {
      if (data.count === 0) {
        fabricsTable.replaceChildren(...children); // clear this for safety
        return 0;
      } else {
        for (let i = 0; i < data.fabrics.length; i++) {
          let editButton = `<td><button type="button" class="fabricEditButton" data-id=${data.fabrics[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="fabricDeleteButton" data-id=${data.fabrics[i]._id}>delete</button></td>`;
          let patternMatchButton =`<td><button type="button" class="patternMatchButton" data-id=${data.fabrics[i]._id}>find match</button></td>`;
          let rowHTML = `<td>${data.fabrics[i].fabricName}</td><td>${data.fabrics[i].fabricType}</td><td>${data.fabrics[i].fabricWeight}</td><td>${data.fabrics[i].fabricLength}</td><td>${data.fabrics[i].fabricContent}</td><td>${data.fabrics[i].fabricColor}</td><td>${data.fabrics[i].fabricStore}</td><td>${data.fabrics[i].fabricAssignment}</td>${editButton} ${deleteButton} ${patternMatchButton}`;
          let rowEntry = document.createElement("tr");
          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        fabricsTable.replaceChildren(...children);
      }
      return data.count;
    } else {
      message.textContent = data.msg;
      return 0;
    }
  } catch (err) {
    message.textContent = "A communication error occurred.";
    return 0;
  }
}


document.addEventListener("DOMContentLoaded", () => {
    const message = document.getElementById("message");
    const logonRegister = document.getElementById("logon-register");
    const logon = document.getElementById("logon");
    const register = document.getElementById("register");
    const logonDiv = document.getElementById("logon-div");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const logonButton = document.getElementById("logon-button");
    const logonCancel = document.getElementById("logon-cancel");
    const registerDiv = document.getElementById("register-div");
    const name = document.getElementById("name");
    const email1 = document.getElementById("email1");
    const password1 = document.getElementById("password1");
    const password2 = document.getElementById("password2");
    const registerButton = document.getElementById("register-button");
    const registerCancel = document.getElementById("register-cancel");
    const fabrics = document.getElementById("fabrics");
    const fabricsTable = document.getElementById("fabrics-table");
    const fabricsTableHeader = document.getElementById("fabrics-table-header");
    const addFabric = document.getElementById("add-fabric");
    const fabricName = document.getElementById("fabric-name");
    const fabricType = document.getElementById("fabric-type");
    const fabricWeight = document.getElementById("fabric-weight");
    const fabricLength = document.getElementById("fabric-length");
    const fabricContent = document.getElementById("fabric-content");
    const fabricColor = document.getElementById("fabric-color");
    const fabricStore = document.getElementById("fabric-store");
    const fabricAssignment = document.getElementById("fabric-assignment");
    const addingFabric = document.getElementById("adding-fabric");
    const fabricsMessage = document.getElementById("fabrics-message");
    const editCancel = document.getElementById("fabric-edit-cancel");
    const editFabric = document.getElementById("edit-fabric");

    const patternMatches = document.getElementById("pattern-matches");
    const patternMatchMessage = document.getElementById("pattern-match-message")
    const patternMatchesTable = document.getElementById("pattern-matches-table");
    const patternMatchFabricHeader = document.getElementById("pattern-match-fabric-header");
    const patternMatchTableHeader = document.getElementById("pattern-matches-table-header");
    const findNewPatMatch = document.getElementById("find-new-pattern-match");
  
    let showing = logonRegister;
    let token = null;
    document.addEventListener("startDisplay", async () => {
      showing = logonRegister;
      token = localStorage.getItem("token");
      if (token) {
        //if the user is logged in
        logoff.style.display = "block";
        const count = await buildFabricsTable(
          fabricsTable,
          fabricsTableHeader,
          token,
          message
        );
        if (count > 0) {
          fabricsMessage.textContent = "";
          fabricsTable.style.display = "block";
        } else {
          fabricsMessage.textContent = "There are no fabrics to display for this user.";
          fabricsTable.style.display = "none";
        }
        fabrics.style.display = "block";
        showing = fabrics;
      } else {
        logonRegister.style.display = "block";
      }
    });
  
    var thisEvent = new Event("startDisplay");
    document.dispatchEvent(thisEvent);
    var suspendInput = false;
  
    document.addEventListener("click", async (e) => {
      if (suspendInput) {
        return; // we don't want to act on buttons while doing async operations
      }
      if (e.target.nodeName === "BUTTON") {
        message.textContent = "";
      }
      if (e.target === logoff) {
        localStorage.removeItem("token");
        token = null;
        showing.style.display = "none";
        logonRegister.style.display = "block";
        showing = logonRegister;
        fabricsTable.replaceChildren(fabricsTableHeader); // don't want other users to see
        message.textContent = "You are logged off.";
      } else if (e.target === logon) {
        showing.style.display = "none";
        logonDiv.style.display = "block";
        showing = logonDiv;
      } else if (e.target === register) {
        showing.style.display = "none";
        registerDiv.style.display = "block";
        showing = registerDiv;
      } else if (e.target === logonCancel || e.target == registerCancel) {
        showing.style.display = "none";
        logonRegister.style.display = "block";
        showing = logonRegister;
        email.value = "";
        password.value = "";
        name.value = "";
        email1.value = "";
        password1.value = "";
        password2.value = "";
      } else if (e.target === logonButton) {
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email.value,
              password: password.value,
            }),
          });
          const data = await response.json();
          if (response.status === 200) {
            message.textContent = `Logon successful.  Welcome ${data.user.name}`;
            token = data.token;
            localStorage.setItem("token", token);
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            email.value = "";
            password.value = "";
            document.dispatchEvent(thisEvent);
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communications error occurred.";
        }
        suspendInput = false;
      } else if (e.target === registerButton) {
        if (password1.value != password2.value) {
          message.textContent = "The passwords entered do not match.";
        } else {
          suspendInput = true;
          try {
            const response = await fetch("/api/v1/auth/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: name.value,
                email: email1.value,
                password: password1.value,
              }),
            });
            const data = await response.json();
            if (response.status === 201) {
              message.textContent = `Registration successful.  Welcome ${data.user.name}`;
              token = data.token;
              localStorage.setItem("token", token);
              showing.style.display = "none";
              thisEvent = new Event("startDisplay");
              document.dispatchEvent(thisEvent);
              name.value = "";
              email1.value = "";
              password1.value = "";
              password2.value = "";
            } else {
              message.textContent = data.msg;
            }
          } catch (err) {
            message.textContent = "A communications error occurred.";
          }
          suspendInput = false;
        }
      } else if (e.target === addFabric) {
        showing.style.display = "none";
        editFabric.style.display = "block";
        showing = editFabric;
        delete editFabric.dataset.id;
        fabricName.value = "";
        fabricType.value = "";
        fabricWeight.value = "";
        fabricLength.value = "";
        fabricContent.value = "";
        fabricColor.value = "";
        fabricStore.value = "";
        fabricAssignment.value = "";
        addingFabric.textContent = "add";
      } else if (e.target === editCancel) {
        showing.style.display = "none";
        fabricName.value = "";
        fabricType.value = "";
        fabricWeight.value = "";
        fabricLength.value = "";
        fabricContent.value = "";
        fabricColor.value = "";
        fabricStore.value = "";
        fabricAssignment.value = "";
        thisEvent = new Event("startDisplay");
        document.dispatchEvent(thisEvent);
      } else if (e.target === addingFabric) {
        if (!editFabric.dataset.id) {
          // this is an attempted add
          suspendInput = true;
          try {
            const response = await fetch("/api/v1/fabrics", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                fabricName: fabricName.value,
                fabricType: fabricType.value,
                fabricWeight: fabricWeight.value,
                fabricLength: fabricLength.value,
                fabricContent: fabricContent.value,
                fabricColor: fabricColor.value,
                fabricStore: fabricStore.value,
                fabricAssignment: fabricAssignment.value,
              }),
            });
            const data = await response.json();
            if (response.status === 201) {
              //successful create
              message.textContent = "The fabric entry was created.";
              showing.style.display = "none";
              thisEvent = new Event("startDisplay");
              document.dispatchEvent(thisEvent);
              fabricName.value = "";
              fabricType.value = "";
              fabricWeight.value = "";
              fabricLength.value = "";
              fabricContent.value = "";
              fabricColor.value = "";
              fabricStore.value = "";
              fabricAssignment.value = "";
            } else {
              // failure
              message.textContent = data.msg;
            }
          } catch (err) {
            message.textContent = "A communication error occurred.";
          }
          suspendInput = false;
        } else {
          // this is an update
          suspendInput = true;
          try {
            const fabricID = editFabric.dataset.id;
            const response = await fetch(`/api/v1/fabrics/${fabricID}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                fabricName: fabricName.value,
                fabricType: fabricType.value,
                fabricWeight: fabricWeight.value,
                fabricLength: fabricLength.value,
                fabricContent: fabricContent.value,
                fabricColor: fabricColor.value,
                fabricStore: fabricStore.value,
                fabricAssignment: fabricAssignment.value,

              }),
            });
            const data = await response.json();
            if (response.status === 200) {
              message.textContent = "The entry was updated.";
              showing.style.display = "none";
              fabricName.value = "";
              fabricType.value = "";
              fabricWeight.value = "";
              fabricLength.value = "";
              fabricContent.value = "";
              fabricColor.value = "";
              fabricStore.value = "";
              fabricAssignment.value = "";
              thisEvent = new Event("startDisplay");
              document.dispatchEvent(thisEvent);
            } else {
              message.textContent = data.msg;
            }
          } catch (err) {
  
            message.textContent = "A communication error occurred.";
          }
        }
        suspendInput = false;
      }     else if (e.target.classList.contains("fabricEditButton")) {
        editFabric.dataset.id = e.target.dataset.id;
        suspendInput = true;
        try {
          const response = await fetch(`/api/v1/fabrics/${e.target.dataset.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.status === 200) {
            fabricName.value = data.fabric.fabricName;
            fabricType.value = data.fabric.fabricType;
            fabricLength.value = data.fabric.fabricLength;
            fabricContent.value = data.fabric.fabricContent;
            fabricColor.value = data.fabric.fabricColor;
            fabricStore.value = data.fabric.fabricStore;
            fabricAssignment.value = data.fabric.fabricAssignment;
            showing.style.display = "none";
            showing = editFabric;
            showing.style.display = "block";
            addingFabric.textContent = "update";
            message.textContent = "";
          } else {
            // might happen if the list has been updated since last display
            message.textContent = "The fabrics entry was not found";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          }
        } catch (err) {
          message.textContent = "A communications error has occurred.";
        }
        suspendInput = false;   
      
    } else if (e.target.classList.contains("fabricDeleteButton")) {
      editFabric.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
      const response = await fetch(`/api/v1/fabrics/${e.target.dataset.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        message.textContent = "The Fabric has been deleted";
        thisEvent = new Event("startDisplay");
        document.dispatchEvent(thisEvent);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The fabrics entry was not found";
        thisEvent = new Event("startDisplay");
        document.dispatchEvent(thisEvent);
      }
      } catch (err) {
      message.textContent = "A communications error has occurred.";
      }
      suspendInput = false;
    }else if (e.target.classList.contains("patternMatchButton")) {
      editFabric.dataset.id = e.target.dataset.id;
      suspendInput = true;

      const count = async (patternMatchesTable,
        patternMatchFabricHeader,
        patternMatchTableHeader,
        token,
        message)=>{
      try {
          const response = await fetch(`/api/v1/findMatch/matchPattern/${e.target.dataset.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          var children1 = patternMatchFabricHeader;
          var children2 = [patternMatchTableHeader];
          if (response.status === 200) {
            if (data.count === 0) {
              let topRowHTML = `<td>${data.fabrics[i].fabricName}</td>`;
              let topRowEntry = document.createElement("tr");
              topRowEntry.innerHTML = topRowHTML;
              children1.push(topRowEntry);
              patternMatchesTable.replaceChildren(...children1,children2); // clear this for safety
              return 0;
            } else {
                let topRowHTML = `<td>${data.fabrics[i].fabricName}</td>`;
                let topRowEntry = document.createElement("tr");
                topRowEntry.innerHTML = topRowHTML;
                children1.push(topRowEntry);
              for (let i = 0; i < data.patterns.length; i++) {
                let rowHTML = `<td>${data.patterns[i].patternName}</td><td>${data.patterns[i].patternCompany}</td><td>${data.patterns[i].garmentType}</td><td>${data.patterns[i].reqFabricType}</td><td>${data.patterns[i].reqFabricWeight}</td><td>${data.patterns[i].reqFabricLength}</td><td>${data.patterns[i].patternFabricAssignment}</td>`;
                let rowEntry = document.createElement("tr");
                rowEntry.innerHTML = rowHTML;
                children2.push(rowEntry);
              }
              patternMatchesTable.replaceChildren(...children1, children2);
            }
            return data.count;
          } else {
           message.textContent = data.msg;
            return 0;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
          return 0;
        }
      }

      if (count > 0) {
        patternMatchMessage.textContent = "";
        patternMatchesTable.style.display = "block";
      } else {
        patternMatchMessage.textContent ="There are no patterns that match this fabrics";
        patternMatchesTable.style.display = "none";
      }
      patternMatches.style.display = "block";
      showing = fabrics;
      }
    }
    )
  })