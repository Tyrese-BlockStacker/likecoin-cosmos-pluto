<template>
  <div>
    <h3>Fee</h3>
    <div>
      Gas limit: <input v-model.number="inputGasLimit" placeholder="Gas limit"/>
    </div>
    <div>
      Gas price: <input v-model.number="inputGasPrice" placeholder="Gas price"/> {{ DENOM }}
    </div>
    <div>
      Fee: {{ displayedFee }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useTxStore } from '@/stores';

import { DENOM, DENOM_EXPONENT, COIN_NAME } from '@/config';

const txStore = useTxStore();

const inputGasLimit = ref(200000);
const inputGasPrice = ref(100);

watchEffect(() => {
  txStore.fee.amount = inputGasLimit.value * inputGasPrice.value;
  txStore.fee.gasLimit = inputGasLimit.value;
});

const displayedFee = computed(() => {
  return `${inputGasLimit.value * inputGasPrice.value / Math.pow(10, DENOM_EXPONENT)} ${COIN_NAME}`;
});
</script>
