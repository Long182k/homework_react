import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import "./App.css";

type User = {
  fullName: string;
  email: string;
  birthday: string;
  age: number;
};

class Users implements sort{
  list: any[];
  constructor(userlist: User[]) {
    this.list = userlist;
  }
  sortByString(key: string): any[] {
    return []
  }
  sortByNumber(key: string): any[] {
    return []
  }
}

const UserExample = 
[
  {
  "fullName" : "Drake",
  "email" : "Drake@gmail.com",
  "birthday" : "01-02-3000",
  "age" : 20
  },
  {
  "fullName" : "Drake2",
  "email" : "Drake2@gmail.com",
  "birthday" : "01-02-30002",
  "age" : 22
  },

]

const newUser = new Users(UserExample)
// console.log('check newUser',newUser)
newUser.list.map((user) => {
  console.log('check user sort by number', user.sortByNumber())
})


interface sort {
  // sortBygido(key: string): any[]
  sortByString(key: string) : any[]
  sortByNumber(key: string) : any[]
}

class sortBySomeThing extends Users{
  sortBygido(key: string) {
    return [];
  }
  
}

export default function App() {
  const url = "https://random-data-api.com/api/users/random_user?size=10";

  const [users, setUsers] = useState<User[]>([]);
  const [dfData, setDfData] = useState([]);
  const [sort, setSort] = useState("");

  const caculateAge = (date: string) => {
    const born = date.split("-").shift();
    const recentYear = new Date();
    return recentYear.getFullYear() - Number(born);
  };

  const reverseBirthday = (date: string) => {
    return date.split("-").reverse().join("-");
  };

  const usersDto = (users: any) => {
    return users.map((v: any) => {
      return {
        fullName: `${v?.first_name} ${v?.last_name}`,
        email: v?.email,
        birthday: reverseBirthday(v?.date_of_birth),
        age: caculateAge(v?.date_of_birth)
      };
    });
  };

  useEffect(() => {
    axios
      .get(url)
      .then((v: any) => {
        setUsers(usersDto(v?.data));
        setDfData(usersDto(v?.data));
      })
      .then((err) => console.error(err));
  }, []);

  const RenderUserList = useMemo(() => {
    return users.map((v: User) => {
      return (
        <tr>
          <td>{v?.fullName}</td>
          <td>{v?.email}</td>
          <td>{v?.birthday}</td>
          <td>{v?.age}</td>
        </tr>
      );
    });
  }, [users]);

  const sortBy = (key: string) => {
    if (sort === key) {
      setUsers([...users].reverse());
      return true;
    }
    return false;
  };

  const sortByString = (key: string) => {
    console.log('check key',key)
    if (sortBy(key)) return;

    const newUserss = new Users(users as any);

    const newUsers = structuredClone(users).sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return -1;
      }
      if (a[key] > b[key]) {
        return 1;
      }
      return 0;
    });

    setSort(key);
    setUsers(newUsers);
  };

  const sortByDate = (key: string) => {
    if (sortBy(key)) return;

    const newUsers = structuredClone(users).sort((a: any, b: any) => {
      const bfDate = new Date(a[key].split("-").reverse());
      const afDate = new Date(b[key].split("-").reverse());
      return Number(bfDate) - Number(afDate);
    });

    setSort(key);
    setUsers(newUsers);
  };

  const sortByNumber = (key: string) => {
    if (sortBy(key)) return;

    const newUsers = structuredClone(users).sort((a: any, b: any) => {
      return Number(a[key]) - Number(b[key]);
    });

    setSort(key);
    setUsers(newUsers);
  };

  const searchAll = (v: any) => {
    const searchValue = v.target.value;
    const newUsers = dfData.filter((v: any) => {
      const objArr : any = Object.values(v);
      for (let i = 0; i < objArr.length; i++) {
        if (
          objArr[i].toString().toLowerCase().includes(searchValue.toLowerCase())
        ) {
          return objArr;
        }
      }
    });

    setUsers(newUsers);
  };

  return (
    <div className="App">
      <h1>Hello Egitech members</h1>
      <h2>Start fill data and sort in 5 mins</h2>
      <p>https://random-data-api.com/api/users/random_user?size=10</p>
      <div>
        <ul>
          <li>List user from api</li>
          <li>Format Brithday (dd/MM/yyyy)</li>
          <li>Search all</li>
          <li>Sort column desc or asc</li>
        </ul>
      </div>

      <input placeholder="Search" onChange={searchAll} />
      <table>
        <tr>
          <th>
            <button onClick={() => sortByString("fullName")}>Full name</button>
          </th>
          <th>
            <button onClick={() => sortByString("email")}>Email</button>
          </th>
          <th>
            <button onClick={() => sortByDate("birthday")}>BirthDay</button>
          </th>
          <th>
            <button onClick={() => sortByNumber("age")}>Age</button>
          </th>
        </tr>
        <tbody>{RenderUserList}</tbody>
      </table>
    </div>
  );
}
