import React from 'react';
import { Utils } from '../../common';
import CategoryEdit from './CategoryEdit';
import CategoryQuotationEdit from './CategoryQuotationEdit';

let ProductUtils = {
    genCategoryEdit: (category, parent, loadData, length) => {
        Utils.common.renderReactDOM(<CategoryEdit category={category} parent={parent} length={length} loadData={loadData} />);
    },
    genCategoryQuotationEdit: (category, loadData) => {
        Utils.common.renderReactDOM(<CategoryQuotationEdit category={category} loadData={loadData} />);
    }
}
export default ProductUtils;