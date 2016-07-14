module YourTurn {    

    interface IDictionaryPair<K, V> {
        key: K;
        value: V;
    }

    const _hasOwnProperty = Object.prototype.hasOwnProperty;
    const has = function(obj: any, prop: any) {
        return _hasOwnProperty.call(obj, prop);
    };

    function isUndefined(obj: any): boolean {
        return (typeof obj) === 'undefined';
    }

    function isString(obj: any): boolean {
        return Object.prototype.toString.call(obj) === '[object String]';
    }

    function defaultToString(item: any): string {
        if (item === null) {
            return 'COLLECTION_NULL';
        } else if (isUndefined(item)) {
            return 'COLLECTION_UNDEFINED';
        } else if (isString(item)) {
            return '$s' + item;
        } else {
            return '$o' + item.toString();
        }
    }


    export class Dictionary<K, V>{
        protected table: { [key: string]: IDictionaryPair<K, V> };
        protected nElements: number;
        protected toStr: (key: K) => string;
        constructor(toStrFunction?: (key: K) => string) {
            this.table = {};
            this.nElements = 0;
            this.toStr = toStrFunction || defaultToString;
        }
        getValue(key: K): V {
            const pair: IDictionaryPair<K, V> = this.table['$' + this.toStr(key)];
            if (isUndefined(pair)) {
                return undefined;
            }
            return pair.value;
        }
        setValue(key: K, value: V): V {
            if (isUndefined(key) || isUndefined(value)) {
                return undefined;
            }

            let ret: V;
            const k = '$' + this.toStr(key);
            const previousElement: IDictionaryPair<K, V> = this.table[k];
            if (isUndefined(previousElement)) {
                this.nElements++;
                ret = undefined;
            } else {
                ret = previousElement.value;
            }
            this.table[k] = {
                key: key,
                value: value
            };
            return ret;
        }

        remove(key: K): V {
            const k = '$' + this.toStr(key);
            const previousElement: IDictionaryPair<K, V> = this.table[k];
            if (!isUndefined(previousElement)) {
                delete this.table[k];
                this.nElements--;
                return previousElement.value;
            }
            return undefined;
        }

        keys(): K[] {
            const array: K[] = [];
            for (const name in this.table) {
                if (has(this.table, name)) {
                    const pair: IDictionaryPair<K, V> = this.table[name];
                    array.push(pair.key);
                }
            }
            return array;
        }

        values(): V[] {
            const array: V[] = [];
            for (const name in this.table) {
                if (has(this.table, name)) {
                    const pair: IDictionaryPair<K, V> = this.table[name];
                    array.push(pair.value);
                }
            }
            return array;
        }

        forEach(callback: (key: K, value: V) => any): void {
            for (const name in this.table) {
                if (has(this.table, name)) {
                    const pair: IDictionaryPair<K, V> = this.table[name];
                    const ret = callback(pair.key, pair.value);
                    if (ret === false) {
                        return;
                    }
                }
            }
        }

        containsKey(key: K): boolean {
            return !isUndefined(this.getValue(key));
        }

        clear() {
            this.table = {};
            this.nElements = 0;
        }

        size(): number {
            return this.nElements;
        }

        isEmpty(): boolean {
            return this.nElements <= 0;
        }

        toString(): string {
            let toret = '{';
            this.forEach((k, v) => {
                toret += `\n\t${k} : ${v}`;
            });
            return toret + '\n}';
        }
    }
}