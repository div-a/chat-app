const users = [];

export function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(hser);
    return user;
}

export function getCurrentUser(id) {
    return users.find(user.id === id);
}


export function userLeaves(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

export function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}


