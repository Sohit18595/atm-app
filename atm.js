const fs = require("fs");

String.prototype.toTitle = function() {
  return this.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
}
const login = (user) => {
  const users = loadUsers();
  const duplicateUsers = users.find((userList) => {
    return userList.user.toLowerCase() === user.toLowerCase();
  });

  if (!duplicateUsers) {
    users.push({ user: user, balance: 0 ,owed: 0, owedFrom:''});
    console.log(`Hello, ${user.toTitle()}!`);
    console.log(`Your balance is $0`);
    saveUsers(users);
  } else {
    console.log(`Hello, ${duplicateUsers.user.toTitle()}!`)
    console.log(`Your balance is $${duplicateUsers.balance}`);
    if(duplicateUsers.owed) console.log(`Owed $70 $${duplicateUsers.owed} to ${duplicateUsers.owedFrom}`);
  }
  saveSession(user);
};

const deposit = (amount) => {
  const users = loadUsers();
  const findUser = users.find((userList) => {
    return userList.user.toLowerCase() === loadSession().toLowerCase();
  });

  if (findUser) {
    const session = loadSession();
    let totalAmount = Number(amount) + Number(findUser.balance);
    console.log(`Your balance is $${totalAmount}`);
    let foundIndex = users.findIndex(x => x.user.toLowerCase() === session.toLowerCase());
    users[foundIndex] = { user: session, balance: totalAmount, owed: users[foundIndex].owed, owedFrom:users[foundIndex].owedFrom};


    if(findUser.owedFrom){
      const userOwed = users.find((userList) => {
        return userList.user.toLowerCase() === transferTo.toLowerCase();
      });
      //Owed To
      if(Number(userOwed.owed) - Number(findUser.owed) > 0) {
        console.log(`Owed $${Number(userOwed.owed) - Number(findUser.owed)} to ${userOwed.user}`);
      };
      //Owed from
      if(Number(findUser.owed) - Number(userOwed.owed) > 0){
        console.log(`Owed $${Number(findUser.owed) - Number(userOwed.owed)} from ${findUser.user}`);
      }
    }
    saveUsers(users);
  } else {
    console.log(`Please login to proceed.`);
  }
};

const logout = () => { 
  const session = loadSession();
  console.log(`Goodbye, ${session.toTitle()}!`)
  saveSession('');
}

const transfer = (transferTo, amount) => {
  console.log('amount', amount)
  console.log('transferTo', transferTo);
  const users = loadUsers();
  const findUser = users.find((userList) => {
    return userList.user.toLowerCase() === loadSession().toLowerCase();
  });
  const findUserToSend = users.find((userList) => {
    return userList.user.toLowerCase() === transferTo.toLowerCase();
  });

  if(!findUserToSend){
    console.log('User not exists for transfer'); 
    return;
  }
  if (findUser) {
    const session = loadSession();
    let totalAmount = Number(findUser.balance) - Number(amount);
    console.log(`Transferred $${amount} to ${transferTo}`);
    console.log(`Your balance is $${totalAmount}`);
    let foundIndex = users.findIndex(x => x.user.toLowerCase() === session.toLowerCase());
    users[foundIndex] = { user: session, balance: totalAmount, owed: users[foundIndex].owed, owedFrom:users[foundIndex].owedFrom};
    saveUsers(users);

    let foundOwedIndex = users.findIndex(x => x.user.toLowerCase() === findUserToSend.user);
    users[foundOwedIndex] = { user: findUserToSend.user, balance: Number(findUserToSend.balance) + Number(amount), owed: Number(findUserToSend.owed) + Number(amount), owedFrom:findUser.user};
    
    saveUsers(users);
    const findUser1 = users.find((userList) => {
      return userList.user.toLowerCase() === loadSession().toLowerCase();
    });
    const findUserToSend1 = users.find((userList) => {
      return userList.user.toLowerCase() === transferTo.toLowerCase();
    });
    //Owed To
    if(Number(findUserToSend1.owed) - Number(findUser1.owed) > 0) {
      console.log(`Owed $${Number(findUserToSend1.owed) - Number(findUser1.owed)} to ${findUserToSend1.user}`);
    };
    //Owed from
    if(findUser1.owed - findUserToSend1.owed > 0){
      console.log(`Owed $${Number(findUser1.owed) - Number(findUserToSend1.owed)} from ${findUser1.user}`);
    }

    
  } else {
    console.log(`Please login to proceed.`);
  }
};



const saveUsers = (users) => {
  fs.writeFileSync("users.json", JSON.stringify(users));
};
const saveSession = (user) => {
  fs.writeFile("loggedInUser.txt", user, (err)=> {
    if (err) throw err;
  });
};
const loadSession = () => {
  try {
    const dataBuffer = fs.readFileSync("loggedInUser.txt");
    const dataString = dataBuffer.toString();
    return dataString;
  } catch (error) {
    return '';
  }
};
const loadUsers = () => {
  try {
    const dataBuffer = fs.readFileSync("users.json");
    const dataString = dataBuffer.toString();
    return JSON.parse(dataString);
  } catch (error) {
    return [];
  }
};

module.exports = {
  login,
  deposit,
  logout,
  transfer,
  loadUsers
};
