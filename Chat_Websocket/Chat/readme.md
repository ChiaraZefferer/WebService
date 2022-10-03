### Web Service Development
Author: Chiara Zefferer


# WebSocket Chat in ASP.NET Core
Diese Projekt beinhaltet eine Chat-App, die Implementierung erfolgt über einen ASP.NET Core WebSocket Server und einen sehr einfachen Client in HTML und JavaScript. Verwendet werden kann das Projekt in Visual Studio Code (MacBook) oder Visual Studio 2019.

ASP.NET Core ist ein kostenloses Open-Source-Webframewort, dass von Microsoft entwicket wurde.

## Download für Visual Studio 2019 & Visual Studio Code
https://visualstudio.microsoft.com/de/vs/older-downloads/
https://visualstudio.microsoft.com/de/downloads/

## Download für .Net
https://dotnet.microsoft.com/en-us/download

## Hello World mit ASP.NET Core
https://learn.microsoft.com/de-de/aspnet/core/getting-started/?source=recommendations&view=aspnetcore-6.0&tabs=macos

## How-to Websocket
https://www.youtube.com/watch?v=BNZLQCmL1mA&list=PLx3k0RGeXZ_wZ_gYpYXfH6FTK7e0cDL0k
In dieser Reihe von Videos werden WebSockets in verschiedenen Programmiersprachen und Varianten erklärt und programmiert, falls man noch keine Erfahrungen mit Websockets hat sind diese Videos sehr zu Empfehlen um zu verstehen wie alles abläuft. 

## How-to Projekt starten
1. Clone das Projekt an einen beliebigen Ort auf deinem Laptop
2. Öffne die Console/das Terminal und navigiere zum Projekt `Chat`
3. führe das Command `dotnet run`aus
4. Öffne das Dokument `.\Client\index.html`
Es können mehrere Clients in unterschiedlichen Browsern geöffnet werden.
Der Client verbindet sich mit dem port `5000` in `localhost`.

## Hauptbestandteile
1. ConnectionManager: zeichnet verbundenen Benutzer und aktive Sockets auf und kümmert sich um das Abrufen, Hinzufügen und Entfernen der Aufzeichnungen
2. WebSocketHandler: behandelt Vorgänge wie das Senden und Empfangen von Nachrichten, die Behandlung von Verbindungs- und Trennungsereignissen.
3. WebSocketMiddleware: wenn ein WebSocket request empfangen wird, wird die Verbidnung akzeptiert und der Socket an die OnConnected Methode vom Handler weitergeleitet. Es werden auch die eindeutigen Benutzernamen überprüft und auf neue Daten gewartet, solange sich der Socket im Zusand Open befindet. 

## Unique Benutzer
Eine Anforderung für das Projekt ist, dass der Benutzername eindeutig sein muss.
Dies wurde implementiert mit `ws://localhost:5000/ws?username=`. 
Der Server validiert ob  `username` ein gütliger Benutzername ist (uniqe, nicht leer), falls ja wird zu den Benutzern/Sockets hinzugefügt, andernfalls wird der Socket geschlossen.
Was man beachten sollte, ist das sensible Daten nicht in so einem query string offengelegt werden sollten, auch nicht wenn HTTPS oder WSS verwendet ist (der Inhalt ist zwar verschlüsselt, aber die URL könnte z.B. in Serverprotokollen aufgezeichnet werden).

## Message
1. `ClientMessage`: ist die vom Client an den Server gesendete Nachricht. Diese enthält folgende Attribute:
 - `Type`: es gibt zwei Werte `CHAT`(zeigt an, dass es sich um eine Nachricht handelt, die an andere Benutzer gesendet werden soll) oder `CONNECTION`(wird beim Öffnen von WebSockets an den Server gesendet)
 - `Sender`: entspricht dem Benutzernamen des Absenders
 - `Receiver`: der Benutzer, an den die Nachricht gerichtet ist. Wenn sie leer ist geht der Server davon aus, dass der Empfänger "Alle" ist.
 - `Content`: der eigentliche Nachrichteninhalt von der Benutzereingabe
2. `ServerMessage`: ist die Nachricht, die vom Server an die Clients gesendet wird. Es wird immer dann ausgelöst, wenn ein Benutzer eine Verbindung herstellt, trennt oder eine Nachricht sendet. Diese enthält folgende Attribute:
 - `Type`: es gibt wieder zwei mögliche Werte `CHAT`(zeigt an, dass es sich um eine von einem Benutzer empfangene Nachricht handelt, die an andere Benutzer gesendet wird) oder `CONNECTION`(zeigt an, ob ein Benutzer den Raum betreten oder verlassen hat)
 - `Content`: der eigentliche Nachrichteninhalt. Falls es sich um eine Chat Nachricht handelt: `ClientMessage`: `<Sender> an <Receiver: <Content>`. Wenn es sich um eine Verbindungsnachricht handelt, gibt der Inhalt den Benutzernamen an und ob er den Raum betreten oder verlassen hat.
 - `Users`: gibt eine Liste der verbundenen Benutzer zurück. Der Client erhält diese Liste, damit ein Benutzer auswählen kann, wer der Empfänger einer Nachricht sein soll.

 ### Referenzen
- Microsoft documentation on WebSockets: [WebSockets support in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/websockets?view=aspnetcore-3.1)
- Microsoft documentation on Middlewares: [Write custom ASP.NET Core middleware
](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/middleware/write?view=aspnetcore-3.1)
- Radu Matei's [Creating a WebSockets middleware for ASP .NET Core 3
](https://radu-matei.com/blog/aspnet-core-websockets-middleware/)