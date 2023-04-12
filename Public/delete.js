
     else if (e.target.classList.contains("fabricDeleteButton")) {
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
  showing.style.display = "none";
  showing = fabrics;
  showing.style.display = "block";
  //addingFabric.textContent = "update";
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



}