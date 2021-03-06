import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { ProductDto } from '../../Interface/Interface';
import { Dropdown } from '../Dropdown/Dropdown';
import { Spinner } from '../Spinner/Spinner';
import { NotFound } from '../NotFound/NotFound';
import { ProductCard } from '../ProductCard/ProductCard';
import { ProductTotal } from '../ProductTotal/PorductTotal';
import style from './Product.module.css'
import { ProductApiService } from '../../Services/ProductApiService/ProductApiService';

export const Product = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [products, setProduct] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const ColourOptions = [
        { label: 'Black', value: 'black' },
        { label: 'Stone', value: 'stone' },
        { label: 'Red', value: 'red' },
    ]

    const getProducts = async () => {
        try {
            const response = await ProductApiService.getProducts();
            setIsLoading(false);
            setProduct(response.data);
            setFilteredProducts(response.data);
        }
        catch (e) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProducts()
    }, [])

    const handleFilter = (e: string) => {
        if (e) {
            let products = filteredProducts.filter((product: ProductDto) => product.colour.toLowerCase() === e.toLowerCase());
            setProduct(products);
        }
        else {
            setProduct(filteredProducts);
        }
    };

    return (
        <div className={style.product}>
            <Grid container className={style.product__filters}>
                <Grid item sm={6}>
                    <Dropdown name={'Select Colour Filter'} options={ColourOptions} selectedValue={handleFilter} />
                </Grid>

                <Grid item sm={6} className={style.justifyEnd}>
                    <ProductTotal />
                </Grid>
            </Grid>
            <Grid item md={12}>
                <div className={style.justifyCenter}>
                    {isLoading ? <Spinner /> : null}
                </div>
                {products.length === 0 && !isLoading ? <NotFound /> : products.map((product: ProductDto, i: number) =>
                    <ProductCard
                        id={product.id}
                        key={i}
                        img={product.img}
                        name={product.name}
                        price={product.price}
                        colour={product.colour} />
                )
                }
            </Grid>
        </div>
    )
}

