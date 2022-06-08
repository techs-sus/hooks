const printf = (s: string, ...s1: string[]) => print(string.format(s, ...s1));

class hookManager {
	private hooks: {
		[key: string]: {
			func: Callback;
			dependencies: string[];
		};
	} = {};
	public addHook(hookName: string, callback: Callback, dependencies: string[], event?: RBXScriptSignal) {
		const fire = (...args: unknown[]) => {
			const ret: unknown = callback(...args);
			// pass on the return value of the cb
			for (const dependency of dependencies) {
				this.fireHook(dependency, ret);
			}
		};
		if (event !== undefined) {
			event.Connect(fire);
			printf("[hook] %s is para-connected to an RBXScriptSignal", hookName);
		} else {
			printf("[hook] Added: %s", hookName);
		}
		this.hooks[hookName] = {
			dependencies: dependencies,
			func: fire,
		};
	}
	public fireHook(hookName: string, ...args: unknown[]) {
		if (this.hooks[hookName] === undefined) {
			printf("[hook] not found: %s", hookName);
			return;
		}
		this.hooks[hookName].func(...args);
	}
}

export default hookManager;
