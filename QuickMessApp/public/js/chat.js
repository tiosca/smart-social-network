let socket = io();
let messages = document.getElementById("message_inbox");
let contacts = document.getElementById("contacts");
let user_id = document.getElementById("chat_user_id").value;
let friend_id = document.getElementById("chat_friend_id").value;
let user_photo = document.getElementById("chat_user_photo").value;
let friend_photo = document.getElementById(friend_id).src;
let contact_current = document.getElementsByClassName("active change_chat")[0];


socket.emit("establish connection", {"user_id": user_id, "friend_id": friend_id});

const own_message = function (content, date, img) {

    let div_element_1 = document.createElement("div");
    div_element_1.className = "d-flex justify-content-start mb-4 ml-5";

    let div_element_11 = document.createElement("div");
    div_element_11.className = "img_cont_msg";

    let img_element = document.createElement("img");
    img_element.src = img;
    img_element.className = "rounded-circle user_img_msg";
    div_element_11.appendChild(img_element);

    let div_element_12 = document.createElement("div");
    div_element_12.className = "msg_cotainer"
    div_element_12.innerHTML = content;
    let span_element = document.createElement("span");
    span_element.className = "msg_time";
    span_element.innerHTML = date;
    div_element_12.appendChild(span_element);

    div_element_1.appendChild(div_element_11);
    div_element_1.appendChild(div_element_12);

    messages.appendChild(div_element_1);
    messages.scrollTop = messages.scrollHeight;
};

const other_message = function (content, date, img) {

    let div_element_1 = document.createElement("div");
    div_element_1.className = "d-flex justify-content-end mb-4 mr-5";

    let div_element_11 = document.createElement("div");
    div_element_11.className = "msg_cotainer_send"
    div_element_11.innerHTML = content;
    let span_element = document.createElement("span");
    span_element.className = "msg_time_send";
    span_element.innerHTML = date;
    div_element_11.appendChild(span_element);

    let div_element_12 = document.createElement("div");
    div_element_12.className = "img_cont_msg";

    let img_element = document.createElement("img");
    img_element.src = img;
    img_element.className = "rounded-circle user_img_msg";
    div_element_12.appendChild(img_element);

    div_element_1.appendChild(div_element_11);
    div_element_1.appendChild(div_element_12);
    messages.appendChild(div_element_1);
    messages.scrollTop = messages.scrollHeight;
};

const add_user = function(friend){
    console.log("Trying to insert " + JSON.stringify(friend));
    console.log(friend.id);
    let li_element = document.createElement("li");
    li_element.className = "change_chat";
    li_element.dataset.value = (friend.id).toString();

    let div_element = document.createElement("div");
    div_element.className = "d-flex bd-highlight";

    let div_element_11 = document.createElement("div");
    div_element_11.className = "img_cont";

        let img_element = document.createElement("img");
        img_element.src = friend.profileImagePath;
        img_element.className = "rounded-circle user_img";
        img_element.id = friend.id;

        let span_element = document.createElement("span");
        span_element.className = "online_icon " + friend.status;

        div_element_11.appendChild(img_element);
        div_element_11.appendChild(span_element);


    let div_element_12 = document.createElement("div");
    div_element_12.className = "user_info";
        let input_element_1 = document.createElement("input");
        input_element_1.className = "name " + friend.id;
        input_element_1.value = friend.firstName;
        let input_element_2 = document.createElement("input");
        input_element_2.className = "status " + friend.id;
        input_element_2.value = friend.status;
        input_element_1.setAttribute("type", "hidden");
        input_element_2.setAttribute("type", "hidden");

        let span_element_2 = document.createElement("span");
        span_element_2.innerHTML = friend.firstName + " " + friend.lastName;

        let p_element = document.createElement("p");
        p_element.innerHTML = name + " is " + friend["status"];

    div_element_12.appendChild(input_element_1);
    div_element_12.appendChild(input_element_2);
    div_element_12.appendChild(span_element_2);
    div_element_12.appendChild(p_element);

    div_element.appendChild(div_element_11);
    div_element.appendChild(div_element_12);

    li_element.appendChild(div_element);
    contacts.appendChild(li_element);
    contacts.scrollTop = contacts.scrollHeight;
    console.log("Finished inserting");
};


const display_message = function (content, date, own = true, img = "https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"){
    if (own){
        own_message(content, date, img);
    } else {
        other_message(content, date, img);
    }
};



//-----------------------define rephrase functionality on client------------------------------
let rephrase_number_of_words = 50;
//-----------------------------------------------------


(function () {
    $(document).on("click", "#message_translate", function (event) {
        event.preventDefault(); // cancel default behavior
        console.log("Click on message_translate");

        let message_value = $("#message").val();
        if (!message_value) {
            return;
        }
        rephrase_number_of_words = Math.max(5, rephrase_number_of_words - 10)
        console.log(message_value)
        console.log(rephrase_number_of_words)

        $.ajax({
            type: "POST",
            url: "/rephrase-message",
            data: {"message": message_value, "word_number": -2},
            beforeSend: function () {
                // Show the loading overlay before sending the AJAX request
                $("#loading-overlay").css("display", "flex");
            },
            success: function (result) {
                console.log(result);
                let new_message = result.message;
                while (new_message.includes("\n")) {
                    new_message = new_message.replace("\n", "");
                }
                $("#message").val(new_message)
            },
            error: function (e) {
                console.log(e.status);
            },
            complete: function () {
                // Hide the loading overlay after the AJAX request is complete (success or error)
                $("#loading-overlay").css("display", "none");
            }
        });
    }),

    // -----------------------define rephrase functionality on client------------------------------
    $(document).on("click", "#message_shrink", function (event) {
        event.preventDefault(); // cancel default behavior
        console.log("Click on message_shrink");

        let message_value = $("#message").val();
        if (!message_value) {
            return;
        }
        rephrase_number_of_words = Math.max(5, rephrase_number_of_words - 10)
        console.log(message_value)
        console.log(rephrase_number_of_words)

        $.ajax({
            type: "POST",
            url: "/rephrase-message",
            data: {"message": message_value, "word_number": -1},
            beforeSend: function () {
                // Show the loading overlay before sending the AJAX request
                $("#loading-overlay").css("display", "flex");
            },
            success: function (result) {
                console.log(result);
                let new_message = result.message;
                while (new_message.includes("\n")) {
                    new_message = new_message.replace("\n", "");
                }
                $("#message").val(new_message)
            },
            error: function (e) {
                console.log(e.status);
            },
            complete: function () {
                // Hide the loading overlay after the AJAX request is complete (success or error)
                $("#loading-overlay").css("display", "none");
            }
        });
    }),



    $(document).on("click", "#message_extend", function (event) {

        event.preventDefault(); // cancel default behavior
        console.log("Click on message_extend");

        let message_value = $("#message").val();
        if (!message_value) {
            return;
        }

        rephrase_number_of_words = Math.min(300, rephrase_number_of_words + 10)
        console.log(message_value)
        console.log(rephrase_number_of_words)

        $.ajax({
            // async: false,
            type: "POST",
            url: "/rephrase-message",
            data: {"message": message_value, "word_number": 1},
            beforeSend: function () {
                // Show the loading overlay before sending the AJAX request
                $("#loading-overlay").css("display", "flex");
            },
            success: function (result) {
                console.log(result);
                let new_message = result.message;
                while (new_message.includes('\n')) {
                    new_message = new_message.replace("\n", "");
                }

                $("#message").val(new_message)

            },
            error: function (e) {
                console.log(e.status);

            },
            complete: function () {
                // Hide the loading overlay after the AJAX request is complete (success or error)
                $("#loading-overlay").css("display", "none");
            }
        });
    }),
    // -----------------------------------------------------

    $("#message_send_form").submit(function (e) {
        if ($("#message").val() === "") {
            return false;
        }
        display_message($("#message").val(), moment().utcOffset(+2).format('YYYY-MM-DD, HH:mm:ss'), true, user_photo)


        e.preventDefault(); // prevents page reloading
        let data = {"data": $("#message").val(),
                    "user_id": user_id,
                    "friend_id": friend_id,
                    "date": moment().utcOffset(0).format()
        }
        console.log(data);
        socket.emit("chat message", data);
        $("#message").val("");
        let elementNrMessages = document.getElementById("friend_number_of_messages");
        elementNrMessages.innerHTML = (1 + parseInt(elementNrMessages.innerHTML)).toString();
        return false;
    });

    socket.on("received", data => {
        console.log(data);
        console.log("Received message with socket from " + data["user_id"]);
        if (friend_id === data["user_id"]){
            display_message(data.data, moment(data.date).utcOffset(+2).format('YYYY-MM-DD, HH:mm:ss'), false, friend_photo)
        }
    });

    socket.on("change friend approved", messages => {
        console.log("change friend inbox accepted");
        console.log(messages);
        if (messages != null){
            console.log(JSON.stringify(messages));
            document.getElementById("friend_number_of_messages").innerHTML = messages.length;
            for( let i = 0; i < messages.length; i++){
                let date = moment(messages[i].date).utcOffset(+2).format('YYYY-MM-DD, HH:mm:ss')
                if (user_id === messages[i]["sender"]){
                    own_message(messages[i].data, date, user_photo);
                } else {
                    other_message(messages[i].data, date, friend_photo);
                }
            }
        } else {
            document.getElementById("friend_number_of_messages").innerHTML = 0;
        }
        //$("#message_send").prop('disabled', false);
    });
    $(document).on("click", "#contacts li", function () {
        console.log("Click on friend");

        //$("#message_send").prop('disabled', true);
        contact_current.className = 'change_chat';
        $(this).attr('class', 'active change_chat');
        let new_friend_id = $(this).data("value");
        let new_friend_src = document.getElementById(new_friend_id).src;
        let new_friend_name = document.getElementsByClassName("name " + new_friend_id)[0].value;
        let new_friend_status = document.getElementsByClassName("status " + new_friend_id)[0].value;

        console.log("New friend id: " + new_friend_id);
        console.log("New friend src: " + new_friend_src);
        console.log("New friend name: " + new_friend_name);
        console.log("New friend status: " + new_friend_status);

        document.getElementById("currentFriendImage").src = new_friend_src;
        document.getElementById("friend_online_status").className = "online_icon " +  new_friend_status;
        document.getElementById("friend_firstname").innerHTML = "Chat with " + new_friend_name;

        //TO TO: number of messages
        console.log("Changing chat_friend_id value from " + document.getElementById("chat_friend_id").value);
        console.log("To " + document.getElementById("chat_friend_id").value);

        document.getElementById("chat_friend_id").value = new_friend_id;
        contact_current = document.getElementsByClassName("active change_chat")[0];
        friend_id = new_friend_id;
        friend_photo = new_friend_src;

        socket.emit("change friend", {"user_id": user_id, "friend_id": friend_id});

        messages.innerHTML = "";
    });
    $(document).on("click", "#search_chat_button", function () {
        let value_to_search = $("#search_chat_button_value").val();
        console.log("Chat to search: " + value_to_search);
        $.ajax({
            async: false,
            type: "POST",
            url: "/search-friend",
            data: {"value": value_to_search},
            success: function (result) {
                console.log(result["users"]);
                contacts.innerHTML = '';
                for (let i = 0; i < result["users"].length; i++){
                    add_user(result["users"][i]);
                }
            },
            error: function (e) {
                console.log(e.status);
            }
        });
    });
    $("#search_chat_button_value").keypress(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#search_chat_button").click();
        }
    });
    $(document).ready(function () {
        const textarea = $("#message")[0];
        const defaultHeight = textarea.style.height;
        const maxHeight = 200; // Maximum height in pixels
        let isScrolling = false; // Flag to indicate scrolling state
        let scrollPosition = 0; // Variable to store the scroll position

        function adjustTextAreaHeight() {
            if (!isScrolling) {
                const scrollTop = textarea.scrollTop; // Store the current scroll position
                textarea.style.height = "auto";
                textarea.style.height = (textarea.scrollHeight) + "px";

                if (textarea.scrollHeight > maxHeight) {
                    textarea.style.overflowY = "scroll";
                    textarea.style.height = maxHeight + "px";
                } else {
                    textarea.style.overflowY = "hidden";
                }

                textarea.scrollTop = scrollTop; // Restore the previous scroll position
            }
        }

        // Initial adjustment on page load
        adjustTextAreaHeight();

        // Continuously adjust textarea height
        $("#message").on("input", function () {
            adjustTextAreaHeight();
        });

        // Adjust every 100 milliseconds using setInterval
        const intervalId = setInterval(function () {
            adjustTextAreaHeight();
        }, 100);

        // Set scrolling flag when textarea is scrolled
        textarea.addEventListener("scroll", function () {
            isScrolling = true;
        });

        // Clear scrolling flag after scrolling stops
        let scrollTimeout;
        textarea.addEventListener("scroll", function () {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function () {
                isScrolling = false;
            }, 100);
        });

        // Reset textarea size to smaller height if there is no text
        $("#message").on("blur", function () {
            if ($(this).val() === "") {
                textarea.style.height = "50px"; // Set a smaller height value
            }
        });

        // Reset textarea size to default if there is text on focus
        $("#message").on("focus", function () {
            if ($(this).val() !== "") {
                textarea.style.height = defaultHeight; // Set the default height value
            }
        });
    });
})();
