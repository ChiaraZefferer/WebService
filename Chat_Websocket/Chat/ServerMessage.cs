using System.Collections.Generic;
namespace Chat{
    public class ServerMessage{
         public ServerMessage(){
            Users = new List<string>();
        }
        public ServerMessage(MessageType messageType, string messageContent, List<string> users){
            Type = messageType.ToString();
            Content = messageContent;
            Users = users;
        }
        public ServerMessage(ClientMessage clientMessage) {
            Type = clientMessage.GetMessageType();
            Content = clientMessage.BuildChatMessageBody();
        }
        public ServerMessage(string userName, bool isDisconnect, List<string> users){
            Type = MessageType.CONNECTION.ToString();
            Content = this.BuildConnectionMessageBody(userName, isDisconnect);
            Users = users;
        }
        public string Type { get; set; }
        public string Content { get; set; }
        public List<string> Users { get; set; }
        private string BuildConnectionMessageBody(string userName, bool isDisconnect){
            if (isDisconnect)
                return $"Benutzer {userName} hat den Chat verlassen.";
            
            else
                return $"Benutzer {userName} hat den Raum betreten.";
        }
    }
}