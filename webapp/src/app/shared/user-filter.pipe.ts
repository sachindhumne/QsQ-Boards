import { PipeTransform, Pipe} from '@angular/core';

@Pipe({
    name: 'userFilter'
})

export class UserFilterPipe implements PipeTransform{
    transform(users:any[],searchTerm:any){
        if(!users || !searchTerm){
            return users;
        }

        return users.filter(user => user.userName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    }
}