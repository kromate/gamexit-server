// add players into the room object and if the id doesn't exist then create a room
// run checks to ensure only two players can join a room
// if that

class RoomHandler {
	io: any
	socket: any
	rooms: Record<string, string[]>
	constructor(io, socket) {
		this.io = io
		this.socket = socket
		this.rooms = {}
	}

	async joinGame(message) {
		const connectedSockets = this.io.sockets.adapter.rooms.get(message.roomId)
		if (!this.rooms[message.roomId])
			this.rooms[message.roomId] = [message.userId]

		if (connectedSockets && connectedSockets.size === 2) {
			this.socket.emit('tic_room_join_error', {
				status: 412,
				error: 'Room is full please choose another room to play!'
			})
		} else {
			await this.socket.join(message.roomId)
			this.socket.emit('tic_room_joined')

			if (this.io.sockets.adapter.rooms.get(message.roomId).size === 2) {
				this.socket.emit('tic_start_game', { start: true, symbol: 'x' })
				this.socket
					.to(message.roomId)
					.emit('tic_start_game', { start: false, symbol: 'o' })
			}
		}
	}

	getRooms() {
		return this.rooms
	}

	private getRoomPlayerCount(roomId, playerId) {
        if (this.rooms[roomId]) {
            this.rooms[roomId].filter()
		} else {
			this.socket.emit('tic_room_join_error', {
				status: 412,
				error: 'This Room doesn\'t exist or can\'t be created'
			})
		}
	}
}

module.exports = RoomHandler
