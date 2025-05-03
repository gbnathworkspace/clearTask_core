export interface userdto {
    userId: string,
    firstName: string,
    lastName: string ,
    email: string,
    userName: string,
    phonenumber?: string,
    noOfTasks?: number,
    address?: string,
    age? :number
}

export default userdto;