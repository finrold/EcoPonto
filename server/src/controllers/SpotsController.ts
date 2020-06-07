import knex from '../database/connection';
import { Request, Response } from 'express';


class SpotsController {
    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()))

        const spots = await knex('spots')
            .join('spot_items', 'spots.id', '=', 'spot_items.spot_id')
            .whereIn('spot_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('spots.*')


        return response.json(spots)
    }

    async show(request: Request, response: Response) {
        const {id} = request.params;

        const spot = await knex('spots').where('id', id).first();

        if(!spot) {
            return response.status(400).json({ message: 'Spot not found. '});
        }

        const items = await knex('items')
            .join('spot_items', 'items.id', '=', 'spot_items.item_id')
            .where('spot_items.point_id', id)
            .select('items.title');

        return response.json({ spot, items})
    }
    async create (request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction();

        const spot = {
            
                image :'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf
            };
        
    
        const insertedIds = await trx('spots').insert(spot);
    
        const spot_id = insertedIds[0];
    
        const spotItems = items.map((item_id: number) => {
            return {
                item_id,
                spot_id,
            };
        });
        
        await trx('spot_items').insert(spotItems);

        await trx.commit();
    
        return response.json({
            id: spot_id,
            ...spot,
        });
    }
}

export default SpotsController;