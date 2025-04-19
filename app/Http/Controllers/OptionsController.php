<?php

namespace App\Http\Controllers;

use App\Models\Options;
use App\Traits\HasFileUploads;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use PhpOption\Option;
use Stancl\Tenancy\Contracts\Tenant;

class OptionsController extends Controller
{
    use HasFileUploads;

    const X_ACCOUNTAK_ONBOARDING = 'X-ACCOUNTAK-ONBOARDING';

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return response(Options::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Tenant $tenant): Response
    {
        // $request->merge(['id' => $request->user()->organization->options->id]);
        Log::info($request->file(), [__LINE__, __FILE__]);
        if ($request->file('logo_file')) {
            $directory = 'logos/'.$tenant->id;
            $file = $request->file('logo_file');
            if ($fileUploadedData = $this->uploadSingleFile($file, $directory)) {
                $request->merge(['logo' => 'storage/'.$fileUploadedData['filepath']]);
            }
        }
        Log::info($request->all(), [__LINE__, __FILE__]);


        $optionsData = $request->except(['logo', 'logo_file']);
        $options = $tenant->options->update($optionsData);
        // $options = $request->user()
        //         ->organization
        //         ->options()
        //         ->update($request->except(['logo', 'logo_file'])->toArray());
                Log::info([$optionsData, $request->all()], [__LINE__, __FILE__]);

        $onboarded = $tenant
                ->update([
                    'onboarded' => 1,
                    'logo' => $request->get('logo'),
                ]);
                Log::info($request->all(), [__LINE__, __FILE__]);

        return response($tenant->options)->withoutCookie(self::X_ACCOUNTAK_ONBOARDING);
    }

    /**
     * Display the specified resource.
     */
    public function show(Options $options): Response
    {

        return response($options);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Options $options): Response
    {
        $options->update($request->all());
        return response($options);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Options $options): Response
    {
        $options->delete();
        return new Response(null, 204);
    }
}
