//docInputSearch = 'input._2zCfw'
docInputSearch = '[title="Search or start new chat"]'
docSelectedChatSearchButton = 'span[data-icon="search-alt"]'
docChatTextBox = 'div[contenteditable=true]'
docEmojiButton = 'span[data-icon=smiley]'
docSmileyButton = 'span[data-icon=smiley]'
docGifButton = 'span[data-icon=gif]'
docGifTrendingDiv = '[title="Trending"]'
docStickerButton = 'span[data-icon=sticker]'
docEmojiSmileyPeopleDiv = '[title="Smileys & People"]'
docEmojiRecentDiv = '[title="Recent"]'
docPanelActive = 'div[data-state="open"]'
chatListSelector = '.X7YrQ'
chatListChatSelector = '._2UaNq'
chatActiveChatSelector = '_3mMX1'

function dispatchClick(item) {
    item.dispatchEvent(new window.MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: false
    }));
}

function makeActive(item) {
    const chat = item.querySelector(chatListChatSelector);
    if (chat) {
        dispatchClick(chat);
    }
}

function isItemActive(item) {
    const chat = item.querySelector(chatListChatSelector);
    return chat && chat.classList.contains(chatActiveChatSelector);
}

function makeChatActiveIfNot() {
	activeChat = document.querySelector('.'+chatActiveChatSelector);
	if (!activeChat)
		navigateConversation(1);
}

function getChatList() {
    const chatListElem = document.querySelectorAll(chatListSelector);
    if (chatListElem.length > 0) {
        return Array.from(chatListElem).sort(function (a, b) {
            return parseInt(a.style.transform.match(/\(.*\)/i)[0].match(/\d+/)[0]) - parseInt(b.style.transform.match(/\(.*\)/i)[0].match(/\d+/)[0])
        });
    }
}

function navigateConversation(delta) {
    const chatList = getChatList();

    let index = -1;
    for (let i = 0; i < chatList.length; i++) {
        const item = chatList[i]
        if (isItemActive(item)) {
            index = i + delta;
            break;
        }
    }

    // If no chat is selected, default to moving to the top chat
    if (index == -1 || index >= chatList.length) {
        index = 0;
    }

    let target = chatList[index];
    makeActive(target);
}

function searchChats() {
    const inputSearch = document.querySelector(docInputSearch);
    if (inputSearch) {
        inputSearch.focus();
    }
}

function searchCurrentChat() {
    /*
    // The following 3 dots are not dots. They are square ellipsis.
    const selectedChatSearchButton = document.querySelector('div[title="Search…"]');
    if (selectedChatSearchButton) {
        dispatchClick(selectedChatSearchButton)
    }
    */
    const selectedChatSearchButton = document.querySelector(docSelectedChatSearchButton);
    if (selectedChatSearchButton) {
        dispatchClick(selectedChatSearchButton)
    }
}

function writeInChat() {
    const chatTextBox = document.querySelector(docChatTextBox);
    if (chatTextBox) {
        chatTextBox.focus();
    }
}

function getEmojiPanelTabs(category) {
	if (category == "emoji")
		selectorCategory = docEmojiRecentDiv;
	if (category == "gif")
		selectorCategory = docGifTrendingDiv;
	const categoryDiv = document.querySelector(selectorCategory);
	if (!categoryDiv)
		return null
	const divClass = "." + categoryDiv.classList[0];
	return document.querySelectorAll(divClass);
}

function getActiveEmojiPanel(){
	panelOpen = document.querySelector(docPanelActive)
	if (!panelOpen)
		return null;
	if (getEmojiPanelTabs("emoji"))
		return "emoji";
	else if (getEmojiPanelTabs("gif"))
		return "gif";
	return null;
}

function navigateTabs(category, delta) {
    var navTabs = getEmojiPanelTabs(category);
	var index = -1;
    for (let i = 0; i < navTabs.length; i++) {
        if (navTabs[i].classList.length == 3) {
            index = i + delta;
			index = ((index % navTabs.length) + navTabs.length) % navTabs.length;
            break;
        }
    }
    navTabs[index].click();
}

function clickEmojiButton() {
    const buttonEmoji = document.querySelector(docEmojiButton);
    if (buttonEmoji) {
        buttonEmoji.click();
    }
}

function clickGifButton() {
    const buttonGif = document.querySelector(docGifButton);
    if (buttonGif) {
        buttonGif.click();
    }
}

function showSmileys() {
	// One click for panel, second to switch focus to smileys in case
	// gif or stickers are active in the panel
	makeChatActiveIfNot();
	clickEmojiButton();
	clickEmojiButton();
}

function showGifs(){
	makeChatActiveIfNot();
	clickGifButton();
}

function isKeyCode(keyCode, char) {
    const keyChar = String.fromCharCode(keyCode);
    return keyChar == char || keyChar == char.toUpperCase();
}

function isWhatsappPageReady() {
    const inputSearch = document.querySelector(docInputSearch);
    if (inputSearch)
		return true;
    return false;
}

const intervalId = setInterval(() => {
    bindShortcuts();
}, 5000);

function bindShortcuts() {
    window.removeEventListener('keyup', handleKeyUp);
    window.addEventListener('keyup', handleKeyUp);

    if (isWhatsappPageReady()) {
        clearInterval(intervalId);
    }
}

function handleKeyUp(e) {
    if (!e.altKey)
		return

    switch (e.key || e.keyCode) {
    case 'ArrowUp':
    case 'k':
    case 'KeyK':
        navigateConversation(1);
	break;
    case 'ArrowDown':
    case 'i':
    case 'KeyI':
        navigateConversation(-1);
	break;
    case 'ArrowLeft':
    case 'j':
    case 'KeyJ':
		var activePanel = getActiveEmojiPanel();
		if (activePanel ==  null) {
			e.preventDefault();
			searchChats();
		} else
			navigateTabs(activePanel, -1);
		break;
    case 'ArrowRight':
    case 'l':
    case 'KeyL':
		var activePanel = getActiveEmojiPanel();
		if (activePanel == null) {
			e.preventDefault();
            writeInChat();
		} else
			navigateTabs(activePanel, 1);
		break;
    case ',':
    case 'Comma':
		e.preventDefault();
        showSmileys();
		break;
	case '.':
    case 'Period':
		e.preventDefault();
        showGifs();
		break;
    case ' ':
    case 'Space':
		e.preventDefault();
        searchChats();
		break;
    case 'o':
    case 'KeyO':
		e.preventDefault();
		searchCurrentChat();
		break;
    }
}
