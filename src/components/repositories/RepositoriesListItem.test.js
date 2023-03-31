import {render, screen, act} from '@testing-library/react'
import RepositoriesListItem from './RepositoriesListItem';
import { MemoryRouter } from 'react-router-dom';

// jest.mock('../tree/FileIcon.js', ()=>{
//     return ()=>{
//         return 'File Icon Component'
//     }
// })

function renderComponent(){
    const repository= { 
        full_name:'facebook/react', 
        language: 'Javascript', 
        description: 'A js library', 
        owner: {
            login: 'facebook'
        }, 
        name: 'react',
        html_url: 'https://github.com/facebook/react'
    };

    render(<MemoryRouter>
        <RepositoriesListItem repository={repository} />
    </MemoryRouter> )

    return {repository}
}

test('it should show a link to github homepage for this repository', async ()=>{
    const {repository} = renderComponent();
    // screen.debug();
    // await pause();
    // screen.debug();
    
    // await act(async()=>{
    //     await pause();
    // });

    await screen.findByRole('img', {name: 'Javascript'})

    const link= screen.getByRole('link', {
        name: /github repository/i
    });
    expect(link).toHaveAttribute('href', repository.html_url);
})

test('it should show a fileicon with the appropriate icon ', async ()=>{
    renderComponent();
    const icon=  await screen.findByRole('img', {name: 'Javascript'})
    expect(icon).toHaveClass('js-icon')
});

test('it should show a link to the code editor page', async ()=>{
    const {repository} = renderComponent();
    const link=  await screen.findByRole('link', {
        name: new RegExp(repository.owner.login)
    })
    
    expect(link).toHaveAttribute('href', `/repositories/${repository.full_name}`)

});

const pause = ()=>{
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve();
        }, 100);
    })
}