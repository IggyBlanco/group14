document.addEventListener(`DOMContentLoaded`, function () {
        var userID = localStorage.getItem("userID");
        displayContacts(userID);
      });