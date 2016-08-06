/*
 * StackExchangeNotifications 0.1.3
 * Copyright (c) 2016 Guilherme Nascimento (brcontainer@yahoo.com.br)
 * Released under the MIT license
 *
 * https://github.com/brcontainer/stack-exchange-notification
 */

(function (doc) {
    "use strict";

    var viewHTML, mainBody;

    function loadCss()
    {
        var style = document.createElement("link");

        style.rel  = "stylesheet";
        style.type = "text/css";
        style.href = chrome.extension.getURL("/css/gallery.css");

        document.body.appendChild(style);
    }

    function loadView()
    {
        if (viewHTML) {
            document.body.appendChild(viewHTML.cloneNode(true));
            return;
        }

        var
            xhr = new XMLHttpRequest(),
            uri = chrome.extension.getURL("/view/gallery.html")
        ;

        xhr.open("GET", uri, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200 && mainBody) {
                viewHTML = document.createElement("div");
                viewHTML.innerHTML = xhr.responseText;
                viewHTML = viewHTML.firstElementChild;

                mainBody.appendChild(viewHTML.cloneNode(true));
            }
        };

        xhr.send(null);
    }

    function showPhoto(el)
    {
        console.log(el);
    }

    function eventPhoto(e)
    {
        e.preventDefault();

        setTimeout(showPhoto, 1, this);

        return false;
    }

    function isValid(url)
    {
        return /\.(png|jpeg|jpg|svg|gif)$/i.test(String(url).replace(/\?[\s\S]+$/, ""));
    }

    function setGallery(target)
    {
        if (!target) {
            return;
        }

        var links = target.querySelectorAll("a[href]");

        for (var i = links.length - 1, current; i >= 0; i--) {
            current = links[i];

            if (isValid(current.href) && current.getElementsByTagName("img").length === 1) {
                current.addEventListener("click", eventPhoto);
            }
        }
    }

    function bootGallery()
    {
        mainBody = document.body;

        loadCss();

        loadView();

        var
            question = document.querySelector(".question"),
            answers = document.querySelectorAll("#answers .post-text");

        setGallery(question);

        for (var i = answers.length - 1; i >= 0; i--) {
            setGallery(answers[i]);
        }
    }

    if (/^(interactive|complete)$/i.test(doc.readyState)) {
        bootGallery();
    } else {
        doc.addEventListener("DOMContentLoaded", bootGallery);
        window.addEventListener("load", bootGallery);
    }
})(document);