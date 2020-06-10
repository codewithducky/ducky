window.console = ((originalConsole) => {
    let logger = Object.assign({}, originalConsole);

    logger.log = (args) => {
        let div = document.getElementById('console');
        if (document.body.lastChild != div) {
            document.body.appendChild(document.getElementById('console'))
        }

        div.innerHTML += `<pre>${args}</pre>`;

        div.scrollTop = div.scrollHeight;

        originalConsole.log(args);
    }

    return logger;
})(window.console);