import numpy as np
import pandas as pd
from scipy.spatial import distance 
from sklearn.utils import validation
from sklearn.metrics import pairwise
from scipy.sparse import issparse
import pdb

def gower_distances(X, feature_weight=None, categorical_features=None):
    """
        Computes the gower distances between X and Y
        Gower is a similarity measure for categorical, boolean and numerical mixed
        data.

        Parameters
        ----------
        X : array-like, or pandas.DataFrame, shape (n_samples, n_features)

        Y : array-like, or pandas.DataFrame, shape (n_samples, n_features)

        feature_weight :  array-like, shape (n_features)
            According the Gower formula, feature_weight is an attribute weight.

        categorical_features: array-like, shape (n_features)
            Indicates with True/False whether a column is a categorical attribute.
            This is useful when categorical atributes are represented as integer
            values. Categorical ordinal attributes are treated as numeric, and must
            be marked as false.
            
            Alternatively, the categorical_features array can be represented only
            with the numerical indexes of the categorical attribtes.

        Returns
        -------
        similarities : ndarray, shape (n_samples, n_samples)

        Notes
        ------
        The non-numeric features, and numeric feature ranges are determined from X and not Y.
        No support for sparse matrices.

    """
    
    if issparse(X):
        raise TypeError("Sparse matrices are not supported for gower distance")
        
    # It is necessary to convert to ndarray in advance to define the dtype
    if not isinstance(X, np.ndarray):
        X = np.asarray(X)

    n_rows, n_cols = X.shape
    
    # Numerical columns
    ranges_of_numeric = None
    max_of_numeric = None
    
    # Calculates the normalized ranges and max values of numeric values
    _ ,num_cols=X.shape
    ranges_of_numeric = np.zeros(num_cols)
    max_of_numeric = np.zeros(num_cols)
    for col in range(num_cols):
        col_array = X[:, col].astype(np.float32) 
        max = np.nanmax(col_array)
        min = np.nanmin(col_array)
     
        if np.isnan(max):
            max = 0.0
        if np.isnan(min):
            min = 0.0
        max_of_numeric[col] = max
        ranges_of_numeric[col] = (max - min) if (max != 0) else 0.0

    if feature_weight is None:
        feature_weight = np.ones(n_cols)
        
    y_n_rows, _ = X.shape
        
    dm = np.zeros((n_rows, y_n_rows), dtype=np.float32)
    
    for i in range(n_rows):
        j_start= i
        # for non square results
        if n_rows != y_n_rows:
            j_start = 0

        result= _gower_distance_row(X[i,:],X[j_start:n_rows,:],ranges_of_numeric,max_of_numeric) 
        dm[i,j_start:] = result
        dm[i:,j_start] = result
        
    return dm


def _gower_distance_row(xi_num,xj_num,ranges_of_numeric,max_of_numeric ):

    # numerical columns
    abs_delta=np.absolute( xi_num-xj_num)
    sij_num=np.divide(abs_delta, ranges_of_numeric, out=np.zeros_like(abs_delta), where=ranges_of_numeric!=0)
    sums = np.sum(sij_num,axis=1)

    sum_sij = np.divide(sums,np.ones(xi_num.shape[0]).sum())
    return sum_sij

"""# 4. Get the Gower distance matrix"""

# X = X.dropna()

# D = gower_distances(X)

# print(D)
