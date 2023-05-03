async function buildPatternsTable(patternsTable, patternsTableHeader, token, message) {
    try {
        const response = await fetch("/api/v1/patterns", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        var children = [patternsTableHeader];
        if (response.status === 200) {
          if (data.count === 0) {
            patternsTable.replaceChildren(...children); // clear this for safety
            return 0;
          } else {
            for (let i = 0; i < data.patterns.length; i++) {
              let editButton = `<td><button type="button" class="patternEditButton" data-id=${data.patterns[i]._id}>edit</button></td>`;
              let deleteButton = `<td><button type="button" class="patternDeleteButton" data-id=${data.patterns[i]._id}>delete</button></td>`;
              let fabricMatchButton = `<td><button type="button" class="fabricMatchButton" data-id=${data.patterns[i]._id}>find match</button></td>`;
              let rowHTML = `<td>${data.patterns[i].patternName}</td><td>${data.patterns[i].patternCompany}</td><td>${data.patterns[i].garmentType}</td><td>${data.patterns[i].reqFabricType}</td><td>${data.patterns[i].reqFabricWeight}</td><td>${data.patterns[i].reqFabricLength}</td><td>${data.patterns[i].patternFabricAssignment}</td>${editButton}${deleteButton}${fabricMatchButton}`;
              let rowEntry = document.createElement("tr");
              rowEntry.innerHTML = rowHTML;
              children.push(rowEntry);
            }
            patternsTable.replaceChildren(...children);
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
    const logoff = document.getElementById("logoff");
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
    const patterns = document.getElementById("patterns");
    const patternsTable = document.getElementById("patterns-table");
    const patternsTableHeader = document.getElementById("patterns-table-header");
    const addPattern = document.getElementById("add-pattern");
    const editPattern = document.getElementById("edit-pattern");
    const patternName = document.getElementById("pattern-name");
    const patternCompany = document.getElementById("pattern-company");
    const garmentType = document.getElementById("garment-type");
    const reqFabricType = document.getElementById("req-fabric-type");
    const reqFabricWeight = document.getElementById("req-fabric-weight");
    const reqFabricLength = document.getElementById("req-fabric-length");
    const patternFabricAssignment = document.getElementById("pattern-fabric-assign")
    const addingPattern = document.getElementById("adding-pattern");
    const patternsMessage = document.getElementById("patterns-message");
    const editCancel = document.getElementById("pattern-edit-cancel");

    const fabricMatches = document.getElementById("fabric-matches");
    const fabricMatchMessage = document.getElementById("fabric-match-message")
    const fabricMatchesTable = document.getElementById("fabric-matches-table");
    const fabricMatchPatternHeader = document.getElementById("fabric-match-pattern-header");
    const fabricMatchTableHeader = document.getElementById("fabric-matches-table-header");
    const findNewFabMatch = document.getElementById("find-new-fabric-match");
  
    let showing = logonRegister;
    let token = null;
        document.addEventListener("startDisplay", async () => {
            showing = logonRegister;
            token = localStorage.getItem("token");
            if (token) {
                //if the user is logged in
            logoff.style.display = "block";
            const count = await buildPatternsTable(
                patternsTable,
                patternsTableHeader,
                token,
                message
            );
            if (count > 0) {
                patternsMessage.textContent = "";
                patternsTable.style.display = "block";
            } else {
                patternsMessage.textContent = "There are no patterns to display for this user.";
                patternsTable.style.display = "none";
            }
            patterns.style.display = "block";
            showing = patterns;
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
      patternsTable.replaceChildren(patternsTableHeader); // don't want other users to see
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
    }  else if (e.target === addPattern) {
        showing.style.display = "none";
        editPattern.style.display = "block";
        showing = editPattern;
        delete editPattern.dataset.id;
        patternName.value = "";
        patternCompany.value = "";
        garmentType.value = "";
        reqFabricType.value = "";
        reqFabricWeight.value = "";
        reqFabricLength.value = "";
        patternFabricAssignment.value = "";
        addingPattern.textContent = "add";
      } else if (e.target === editCancel) {
        showing.style.display = "none";
        patternName.value = "";
        patternCompany.value = "";
        garmentType.value = "";
        reqFabricType.value = "";
        reqFabricWeight.value = "";
        reqFabricLength.value = "";
        patternFabricAssignment.value = "";
        thisEvent = new Event("startDisplay");
        document.dispatchEvent(thisEvent);
      } else if (e.target === addingPattern) {
        if (!editPattern.dataset.id) {
          // this is an attempted add
          suspendInput = true;
          try {
            const response = await fetch("/api/v1/patterns", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                patternName: patternName.value,
                patternCompany: patternCompany.value,
                garmentType: garmentType.value,
                reqFabricType: reqFabricType.value,
                reqFabricWeight: reqFabricWeight.value,
                reqFabricLength: reqFabricLength.value,
                patternFabricAssignment: patternFabricAssignment.value,
              }),
            });
            const data = await response.json();
            if (response.status === 201) {
              //successful create
              message.textContent = "The pattern entry was created.";
              showing.style.display = "none";
              thisEvent = new Event("startDisplay");
              document.dispatchEvent(thisEvent);
              patternName.value = "";
              patternCompany.value = "";
              garmentType.value = "";
              reqFabricType.value = "";
              reqFabricWeight.value = "";
              reqFabricLength.value = "";
              patternFabricAssignment.value = "";
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
            const patternID = editPattern.dataset.id;
            const response = await fetch(`/api/v1/patterns/${patternID}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                patternName: patternName.value,
                patternCompany: patternCompany.value,
                garmentType: garmentType.value,
                reqFabricType: reqFabricType.value,
                reqFabricWeight: reqFabricWeight.value,
                reqFabricLength: reqFabricLength.value,
                patternFabricAssignment: patternFabricAssignment.value,
              }),
            });
            const data = await response.json();
            if (response.status === 200) {
              message.textContent = "The entry was updated.";
              showing.style.display = "none";
              patternName.value = "";
              patternCompany.value = "";
              garmentType.value = "";
              reqFabricType.value = "";
              reqFabricWeight.value = "";
              reqFabricLength.value = "";
              patternFabricAssignment.value = "";
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
      } else if (e.target.classList.contains("patternEditButton")) {
        editPattern.dataset.id = e.target.dataset.id;
        suspendInput = true;
        try {
          const response = await fetch(`/api/v1/patterns/${e.target.dataset.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.status === 200) {
            patternName.value = data.pattern.patternName;
            patternCompany.value = data.pattern.patternCompany;
            garmentType.value = data.pattern.garmentType;
            reqFabricType.value = data.pattern.reqFabricType;
            reqFabricWeight.value = data.pattern.reqFabricWeight;
            reqFabricLength.value = data.pattern.reqFabricLength;
            patternFabricAssignment.value = data.pattern.patternFabricAssignment;
            showing.style.display = "none";
            showing = editPattern;
            showing.style.display = "block";
            addingPattern.textContent = "update";
            message.textContent = "";
          } else {
            // might happen if the list has been updated since last display
            message.textContent = "The pattern entry was not found";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          }
        } catch (err) {
          message.textContent = "A communications error has occurred.";
        }
        suspendInput = false;
      } else if (e.target.classList.contains("patternDeleteButton")) {
        editPattern.dataset.id = e.target.dataset.id;
        suspendInput = true;
        try {
        const response = await fetch(`/api/v1/patterns/${e.target.dataset.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = "The Pattern has been deleted";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The Patterns entry was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
        } catch (err) {
        message.textContent = "A communications error has occurred.";
        }
        suspendInput = false;
      }else if (e.target.classList.contains("fabricDeleteButton")) {
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
      }else if (e.target.classList.contains("fabricMatchButton")) {
        editPattern.dataset.id = e.target.dataset.id;
        suspendInput = true;
  
        const count = async (fabricMatchesTable,
          fabricMatchPatternHeader,
          fabricMatchTableHeader,
          token,
          message)=>{
        try {
            const response = await fetch(`/api/v1/findMatch/matchFabric/${e.target.dataset.id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            var children1 = fabricMatchPatternHeader;
             var children2 = [fabricMatchTableHeader];
            if (response.status === 200) {
              if (data.count === 0) {
                fabricMatchMessage.textContent = `There are no matching fabrics for ${e.target.dataset.id.patternName} pattern`;
                fabricMatchesTable.style.display = "none"; 
                return 0;
              } else {
                  let topRowHTML = `<td>${e.target.dataset.id.patternName}</td>`;
                  let topRowEntry = document.createElement("tr");
                  topRowEntry.innerHTML = topRowHTML;
                  children1.push(topRowEntry);
                for (let i = 0; i < data.fabrics.length; i++) {
                  let rowHTML = `<td>${data.fabrics[i].fabricName}</td><td>${data.fabrics[i].fabricType}</td><td>${data.fabrics[i].fabricWeight}</td><td>${data.fabrics[i].fabricLength}</td><td>${data.fabrics[i].fabricContent}</td><td>${data.fabrics[i].fabricColor}</td><td>${data.fabrics[i].fabricStore}</td><td>${data.fabrics[i].fabricAssignment}</td>${editButton} ${deleteButton} ${fabricMatchButton}`;
                  let rowEntry = document.createElement("tr");
                  rowEntry.innerHTML = rowHTML;
                  children2.push(rowEntry);
                }
                fabricMatchesTable.replaceChildren(...children1, children2);
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
  
        if (count.length > 0) {
          fabricMatchMessage.textContent = "";
          fabricMatchesTable.style.display = "block";
        } else {
          fabricMatchMessage.textContent ="There are no fabrics that match this pattern";
          fabricMatchesTable.style.display = "none";
        }
        fabricMatches.style.display = "block";
        showing = fabrics;
        }
      }
      )
  })
