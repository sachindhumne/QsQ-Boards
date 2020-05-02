import { PipeTransform, Pipe} from '@angular/core';

@Pipe({
    name: 'projectFilter'
})

export class ProjectFilterPipe implements PipeTransform{
    transform(projects:any[],searchTerm:any){
        if(!projects || !searchTerm){
            return projects;
        }

        return projects.filter(project => project.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    }
}