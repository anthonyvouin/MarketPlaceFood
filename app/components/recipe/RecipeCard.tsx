import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { RecipeDto } from '@/app/interface/recipe/RecipeDto';
import Link from 'next/link';

const RecipeCard = ({ recipe }: { recipe: RecipeDto }) => {

    const header = (
        <img alt="Card" src={recipe.image} className='w-full h-60 object-cover' />
    );

    const footer = (
        <Link href={`/recipes/${recipe.slug}`}>
            <Button label="Voir la recette" icon="pi pi-eye" className="p-button-text" />
        </Link>
    );

    return (
        <div className="card flex justify-content-center">
            <Card title={recipe.name} subTitle={recipe.category} footer={footer} header={header} className="md:w-25rem">
                <p>{recipe.description}</p>
            </Card>
        </div>
    );
}

export default RecipeCard;
