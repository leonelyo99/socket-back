## Description
This project is based on the idea of the need to have a template. In Front of the need to integrate: chat, notifications, errors. Through client-server communication in real time.

## Made with
The libraries used in the project are `socket.io`, `express`, `bcryptjs`, `mongoose`

## Commands
Los comandos para levantar el proyecto son: `npm install` luego `npm start`

## Fronts
#### [Angular socket front](https://github.com/leonelyo99/socket-front-angular)     
#### [React socket front](https://github.com/leonelyo99/socket-front-react)     
#### [Vue socket front](https://github.com/leonelyo99/socket-front-vue)

## Endpoints
|                |Description                    |Method                       |Request:                     | Response:                   |
|------          |------                         |------                       |------                       |------                       |
|/auth/login     |login                          |POST                         |username: string             |error: boolean               |
|                |                               |                             |password: string             |data: {                      |
|                |                               |                             |                             |        username: string,    |
|                |                               |                             |                             |        _id: string,         |
|                |                               |                             |                             |        token: string        |
|                |                               |                             |                             |      }                      |
|------          |------                         |------                       |------                       |------                       |
|/auth/signup    |signup                         |POST                         |username: string             |error: boolean               |
|                |                               |                             |password: string             |data: {                      |
|                |                               |                             |email: string                |        username: string,    |
|                |                               |                             |                             |        _id: string,         |
|                |                               |                             |                             |        token: string        |
|                |                               |                             |                             |      }                      |
|------          |------                         |------                       |------                       |------                       |
|/user/messages  |bring messages                 |POST                         |users [                      |error: boolean               |
|                |it is necessary to send the    |                             |  {id: string, id: string}   |data: {                      |
|                |token as follows               |                             | ]                           |        messages: [{         |
|                |Bearer + token                 |                             |                             | data: string                |
|                |                               |                             |                             | date: number                |
|                |                               |                             |                             | user: string                |
|                |                               |                             |                             |       }]                    |
|                |                               |                             |                             |     }                       |
|------          |------                         |------                       |------                       |------                       |
|/user/users     |bring users                    |GET                          |                             |error: boolean               |
|                |it is necessary to send the    |                             |                             |data: [{                     |
|                |token as follows               |                             |                             |  username: string           |
|                |Bearer + token                 |                             |                             |  _id: string                |
|                |                               |                             |                             |}]                           |
|------          |------                         |------                       |------                       |------                       |

## Socket Connections
|                                  |Description                    |Request:                     | Response:                   |
|------                            |------                         |------                       |------                       |
|new-message                       |send messages                  |{                            |                             |
|                                  |                               |  message: string            |                             |
|                                  |                               |  room: string               |                             |
|                                  |                               |  user: string               |                             |
|                                  |                               |}                            |                             |
|------                            |------                         |------                       |------                       |
|message-${room}                   |listen to messages from        |                             |error: boolean               |
|                                  |a specific room                |                             |data: {                      |
|                                  |                               |                             |    data: string             |
|                                  |                               |                             |    date: number             |
|                                  |                               |                             |    user: string             |
|                                  |                               |                             |  }                          |
|------                            |------                         |------                       |------                       |
|error                             |listen for backed errors       |                             |error: boolean               |
|                                  |                               |                             |data: string                 |
|------                            |------                         |------                       |------                       |
|notification-${logged user id}    |listen to notifications        |                             |error: boolean               |
|                                  |receives the id of the user    |                             |data: string                 |
|                                  |who has notification           |                             |                             |
|------                            |------                         |------                       |------                       |
