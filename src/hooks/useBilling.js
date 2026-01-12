import { useState, useEffect, useCallback } from 'react';
import { NativePurchases } from '@capgo/native-purchases';
import { Capacitor } from '@capacitor/core';

export const useBilling = () => {
    const [products, setProducts] = useState([]);
    const [isAvailable, setIsAvailable] = useState(false);
    const [loading, setLoading] = useState(true);

    const PRODUCT_IDS = ['donation_small', 'donation_medium', 'donation_large'];

    useEffect(() => {
        const initializeBilling = async () => {
            if (!Capacitor.isNativePlatform()) {
                setLoading(false);
                return;
            }

            try {
                // Initialize checks if billing is supported
                // For direct usage we usually just list products
                const { products: fetchedProducts } = await NativePurchases.getProducts({
                    productIdentifiers: PRODUCT_IDS
                });

                if (fetchedProducts && fetchedProducts.length > 0) {
                    setProducts(fetchedProducts);
                    setIsAvailable(true);
                }
            } catch (error) {
                console.error("Billing initialization failed", error);
                setIsAvailable(false);
            } finally {
                setLoading(false);
            }
        };

        initializeBilling();
    }, []);

    const purchase = useCallback(async (productId) => {
        if (!isAvailable) {
            console.warn("Billing not available");
            return false;
        }

        try {
            await NativePurchases.purchaseProduct({
                productIdentifier: productId,
                quantity: 1,
            });
            return true;
        } catch (error) {
            console.error("Purchase failed", error);
            return false;
        }
    }, [isAvailable]);

    const getProduct = (id) => products.find(p => p.productIdentifier === id);

    return {
        products,
        isAvailable,
        loading,
        purchase,
        getProduct
    };
};
