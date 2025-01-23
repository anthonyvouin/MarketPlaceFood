'use client';
import RoundedButton from '@/app/components/ui/rounded-button';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { ProductDto } from '@/app/interface/product/productDto';
import { formatPriceEuro } from '@/app/pipe/formatPrice';
import { changeDiscount, getAllProducts, toggleProductHighlighting, updateStock } from '@/app/services/products/product';
import { getPageName } from '@/app/utils/utils';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { DiscountDto } from '@/app/interface/discount/discountDto';
import { getAllDiscount } from '@/app/services/discount/discount';
import { PopupAddDiscount } from '@/app/admin/product/popup-add-discount/popup-add-discount';
import { ToastContext } from '@/app/provider/toastProvider';
import { toggleProductVisibility } from '@/app/services/products/product';
import { InputSwitch } from 'primereact/inputswitch';

export default function ProductPage() {
  const { show } = useContext(ToastContext);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [discounts, setDiscounts] = useState<DiscountDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData: ProductDto[] = await getAllProducts();
      setProducts(categoriesData);
    };

    const fetchDiscounts = async () => {
      const discountData: DiscountDto[] = await getAllDiscount();
      setDiscounts(discountData);
    };
    getPageName();
    fetchDiscounts();
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log(products);
  }, [products]);

  const onVisibilityToggle = async (productId: string, newValue: boolean) => {
    try {
      await toggleProductVisibility(productId, newValue);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, visible: newValue } : product
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la visibilité :', error);
    }
  };

  const visibilityTemplate = (product: ProductDto) => {
    return (
      <InputSwitch
        checked={product.visible!}
        onChange={(e) => onVisibilityToggle(product.id!, e.value)}
      />
    );
  };


  const router: AppRouterInstance = useRouter();

  const navigateToRoute = (): void => {
    router.push('product/create-product');
  };

  const handleStockChange = async (event: React.ChangeEvent<HTMLInputElement>, product: ProductDto): Promise<void> => {
    const newStock: number = parseInt(event.target.value, 10) || 0;

    if (product.id) {
      await updateStock(product.id, newStock, 'add')
        .then((): void => {show('Modification de stock', `Le stock du produit ${product.name} a été changé`, 'success');})
        .catch((): void => {show('Erreur modification de stock', `Le stock n'a pu être changé pour le produit ${product.name}`, 'error');});
    }
  };

  const templateStock = (product: ProductDto) => {


    return (
      <input
        type="number"
        min={0}
        defaultValue={product.stock}
        onBlur={(e) => handleStockChange(e, product)}
      />
    );
  };

  const priceFormated = (product: ProductDto) => {
    return formatPriceEuro(product.price);
  };

  const actionBody = (product: ProductDto) => {
    if (product.discount) {
      return <p onClick={(e) => showTemplate(e, product)}>{product.discount.rate} %</p>;
    } else {
      return <div>
        <p onClick={(e) => showTemplate(e, product)}>+ ajouter une remise</p>
      </div>;
    }
  };

  const toggleHighlighting = async (product: ProductDto): Promise<void> => {
    if (product.id) {
      await toggleProductHighlighting(product.id).then((productChange: ProductDto): void => {
        setProducts((prevProducts: ProductDto[]) =>
          prevProducts.map((product: ProductDto): ProductDto =>
            product.id === productChange.id ? { ...product, highlighting: productChange.highlighting } : product
          )
        );
      });
    }
  };

  const highlightingBody = (product: ProductDto) => {
    return <span className={`cursor-pointer pi ${product.highlighting ? 'pi-star-fill text-star' : 'pi-star'}`}
                 onClick={() => toggleHighlighting(product)}>
               </span>;
  };

  const acceptDiscount = async (selectedDiscount: DiscountDto | null, selectedProduct: ProductDto | null): Promise<void> => {
    await changeDiscount(selectedProduct, selectedDiscount).then((newProduct: ProductDto) => {
      show('Changement de remise', 'Le changement de remise a été effectué', 'success');
      if (selectedProduct) {
        setProducts(prevProducts =>
          prevProducts.map(p =>
            p.id === newProduct.id ? newProduct : p
          )
        );
      }
    }).catch((e: Error) => show('Changement de remise', e.message, 'error'));
  };

  const showTemplate = (event, product: ProductDto | null) => {
    let selectedDiscountLocal: DiscountDto | null = null;
    const handleChangeDiscount = (e: string) => {
      if (e) {
        const indexDiscount: number = discounts.findIndex((discount: DiscountDto | null) => {
          if (discount) {
            return discount.id === e;
          }
          return null;
        });
        if (indexDiscount !== -1) {
          selectedDiscountLocal = discounts[indexDiscount];
        } else {
          selectedDiscountLocal = null;
        }
      }
    };

    confirmPopup({
      target: event.currentTarget,
      message: ((<PopupAddDiscount
        discounts={discounts}
        onChangeDiscount={handleChangeDiscount}
        selectedDiscount={product && product.discount ? product.discount?.id : ''}
      />)),
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      rejectClassName: 'p-button-sm mr-3 p-1',
      acceptLabel: 'Enregistrer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-outlined p-button-sm bg-actionColor text-white p-1',
      accept: () => acceptDiscount(selectedDiscountLocal, product),
    });
  };

  const onPageChange = (e) => {
    setCurrentPage(e.page);
    setRowsPerPage(e.rows);
  };

  return (
    <div className="p-6 bg-primaryBackgroundColor h-full">

      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Produits</h1>

      <div className="flex flex-row-reverse pt-1 pb-2.5">
        <RoundedButton onClickAction={() => navigateToRoute()} message="Créer un produit" icon="pi pi-plus" positionIcon="left" classes="border-actionColor text-actionColor"/>
      </div>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">Aucuns produits disponible.</p>
      ) : (
        <div>
          <ConfirmPopup/>
          <DataTable
            value={products}
            tableStyle={{ minWidth: '50rem' }}
            paginator
            rows={rowsPerPage}
            first={currentPage * rowsPerPage}
            onPage={onPageChange}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            currentPageReportTemplate="Affiche {first} au {last} sur les  produits {totalRecords} "
          >
            <Column header="Mise en avant" body={highlightingBody}/>
            <Column field="name" header="Nom"/>
            <Column header="stock" body={templateStock}/>
            <Column field="price" header="Prix" body={priceFormated}/>
            <Column field="name" header="Categorie"/>
            <Column header="Remise" body={actionBody}/>
            <Column header="Visible" body={visibilityTemplate}/>
          </DataTable>
        </div>
      )}
    </div>
  );
}
